import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import UpdateAccount from './UpdateAccount';
import { getAccount, getAccountList, deleteAccount } from 'actions/index';
import SearchBox from 'components/SearchBox';
import SweetAlert from 'react-bootstrap-sweetalert';
import Snackbar from '@material-ui/core/Snackbar';

//칼럼명 지어주는 곳
//label에 쓰는 단어가 화면에 표시
const columnData = [
  {id: 'accountRegNo', align: false, disablePadding: false, label: '등록번호'},
  {id: 'accountNo', align: true, disablePadding: false, label: '계좌번호'},
  {id: 'reference', align: true, disablePadding: false, label: '참고'},
  {id: 'bankCodeName', align: true, disablePadding: false, label: '은행명'},
  {id: 'accountHolder', align: true, disablePadding: false, label: '예금주명'},
  {id: 'accountCategoryCodeName', align: true, disablePadding: false, label: '사용처'},
];

class EnhancedTableHead extends React.Component {
  static propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {onSelectAllClick, order, orderBy, numSelected, rowCount} = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox color="primary"
                      indeterminate={numSelected > 0 && numSelected < rowCount}
                      checked={numSelected === rowCount}
                      onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {/* 칼럼명 나타나는 영역 */}
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}//end of class


let EnhancedTableToolbar = props => {
  const {numSelected} = props;
  const [value, setValue] = React.useState({searchKeyword : ''});

  //검색 키워드 수정
  const updateSearchKeyword = (event) => {
    setValue({
      searchKeyword: event.target.value,
    });
  }

  //검색 기능
  const searchActivity = (event) => {
    event.preventDefault();
    props.getAccountList(value)
  }

  //검색 엔터 기능
  const searchEnterActivity = (event) => {
    if(event.key === 'Enter'){
      props.getAccountList(value)
    }
  }

  return (
    <Toolbar
      className="table-header">
        {/* 상단 툴바
            체크가 되면 selected로 변경됨 */}
      <div className="title">
        {numSelected > 0 ? (
          <Typography variant="subheading">{numSelected} 선택</Typography>
        ) : (
          <Typography variant="title">계좌 목록조회</Typography>
        )}
      </div>

      <div className="spacer"/>

      <div className="actions">
        {numSelected > 0 ? (
          // 툴팁 내용
          <div style={{paddingRight:'10px'}}>
            <Tooltip title="삭제">
              <IconButton aria-label="삭제" onClick={ props.updateUsageStatus }>
                <DeleteIcon/>
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <Tooltip
          title="검색하기"
          placement={'bottom-start'}
          enterDelay={300}>
            <div style={{paddingRight:'20px'}}>
              <SearchBox 
                styleName="d-none d-sm-block" 
                placeholder="계좌번호/참고"
                onChange={updateSearchKeyword}
                value={value.searchKeyword}
                onClick={ event => searchActivity(event) }
                onKeyDown={ event => searchEnterActivity(event) }
              />
            </div>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};


class AccountTable extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: '',
      selected: [],
      // data에 props로 들어오는 list값 넣어주기.
      data: this.props.accountList,
      page: 0,
      rowsPerPage: 10,
      updateDialogOpen: false,
      warning: false,
      user:JSON.parse(localStorage.getItem('user'))
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({data, order, orderBy});
  };
  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({selected: this.state.data.map((row, index) => row.accountRegNo)});
      return;
    }
    this.setState({selected: []});
  };
  handleKeyDown = (event, id) => {
    if (keycode(event) === 'space') {
      this.handleClick(event, id);
    }
  };
  handleClick = (event, id) => {
    const {selected} = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({selected: newSelected});
  };
  handleChangePage = (event, page) => {
    this.setState({page});
  };
  handleChangeRowsPerPage = event => {
    this.setState({rowsPerPage: event.target.value});
  };
  isSelected = id => this.state.selected.indexOf(id) !== -1;

  //계좌 수정 다이얼로그창 띄우기
  updateAcountDialog = (event, accountRegNo) => {
    event.preventDefault();

    if(Number(this.state.user.rankCodeNo) > 1){
      this.props.getAccount(accountRegNo);
      this.AccountUpdateDialogOpen();
    }else{
      this.handleRequestSnackBarOpen("해당 기능에 접근권한이 없습니다.")
    }
  }

  //계좌 수정 다이얼로그창 열기
  AccountUpdateDialogOpen = () => {
    this.setState({ updateDialogOpen : true });
  }

  //계좌 수정 다이얼로그창 닫기
  AccountUpdateDialogClose = () => {
    this.setState({ updateDialogOpen : false });
  }

  //계좌 삭제시 발생 이벤트 삭제확인 다이얼로그 띄움
  updateUsageStatus = () => {
    if(Number(this.state.user.rankCodeNo) > 1){
      this.setState({ warning : true })
    }else{
      this.handleRequestSnackBarOpen("해당 기능에 접근권한이 없습니다.");
    }
  }

  //계좌 삭제 확인 버튼
  deleteFile = () => {
    this.props.deleteAccount(this.state.selected);
    this.setState({
      warning: false,
      selected: []
    })
  };

  //계좌 삭제 취소 버튼
  onCancelDelete = () => {
    this.setState({
      warning: false
    })
  };

  //스낵바 열기
  handleRequestSnackBarOpen = (contents) => {
    this.setState({
      snackbar:true,
      snackbarContents:contents
    })
  }

  //스낵바 닫기
  handleRequestClose = () => {
    this.setState({
      snackbar:false,
      snackbarContents:"",
      open: false
    })
  }


  render() {

    if(this.props.accountList !== this.state.data){
      this.setState({
        data : this.props.accountList
      })
    }

    const {data, order, orderBy, selected, rowsPerPage, page} = this.state;
  
    return (
      <div>
        <EnhancedTableToolbar 
          numSelected={selected.length} 
          getAccountList={this.props.getAccountList}
          updateUsageStatus={this.updateUsageStatus}
        />
        <div className="flex-auto">
          <div className="table-responsive-material">
            <Table>
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                
                {/* props로 받은 list값을 페이지에 맞게 잘라서 map()을 사용함 */}
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                  console.log("page::"+page+" rowsPerPage :: "+rowsPerPage+" index :: "+index+" data.length ::"+data.length);
                  const isSelected = this.isSelected(row.accountRegNo);
                  return (
                    <TableRow
                      hover
                      onKeyDown={event => this.handleKeyDown(event, page*rowsPerPage+index)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={page*rowsPerPage+index}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" checked={isSelected} 
                                  onClick={event => this.handleClick(event, row.accountRegNo)}/>
                      </TableCell>
                      <TableCell align="left">
                        <Tooltip
                          title="수정하기"
                          placement={'bottom-start'}
                          enterDelay={300}>
                            <span onClick={ event => this.updateAcountDialog(event, row.accountRegNo)} style={{cursor:'pointer'}}>
                              {row.accountRegNo}
                            </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="left">{row.accountNo}</TableCell>
                      <TableCell align="left">{row.reference}</TableCell>
                      <TableCell align="left">{row.bankCodeName}</TableCell>
                      <TableCell align="left">{row.accountHolder}</TableCell>
                      <TableCell align="left">{row.accountCategoryCodeName}</TableCell>
                    </TableRow>

                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>

            <UpdateAccount
              open={this.state.updateDialogOpen}
              close={this.AccountUpdateDialogClose}
            />

            <SweetAlert 
              show={this.state.warning}
              warning
              showCancel
              confirmBtnText="삭제"
              confirmBtnBsStyle="danger"
              cancelBtnBsStyle="default"
              cancelBtnText="닫기"
              title="삭제하시겠습니까?"
              onConfirm={this.deleteFile}
              onCancel={this.onCancelDelete}
            >
              삭제시 복구가 불가능합니다
            </SweetAlert>
            
            <Snackbar
            anchorOrigin={{vertical:'top', horizontal:'center'}}
            open={this.state.snackbar}
            autoHideDuration="1500"
            onClose={this.handleRequestClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.snackbarContents}</span>}
          />
          </div>
        </div>
      </div>
    );
  }
}


export default connect(null, { getAccount, getAccountList, deleteAccount })(AccountTable);