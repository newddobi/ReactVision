import React from 'react';
import { connect } from 'react-redux';
import { getCodeList, 
         checkedDepartment,
         checkedRank,
         updateHRCard,
         cleanStoreState } from 'actions/index';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import CardBox from 'components/CardBox';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import FileBase64 from 'components/base64/react-file-base64';
import FindDepart from './FindDepart';
import FindRank from './FindRank';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import GetPostCode from 'components/accounting/GetPostCode';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DatePicker from 'components/date/DatePickers';
import InputLabel from '@material-ui/core/InputLabel';
import MaskedInput from 'react-text-mask';
import Input from '@material-ui/core/Input';
import SaveIcon from '@material-ui/icons/Save';
import clsx from 'clsx';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


//주민등록번호 Mask
class SsnMaskCustom extends React.Component {
  render() {
    return (
      <MaskedInput
        {...this.props}
        mask={[ /\d/, /\d/, /\d/, /\d/,  /\d/,  /\d/, '-', /\d/, /\d/, /\d/, /\d/,  /\d/,  /\d/,  /\d/]}
        placeholderChar={'\u2000'}
        //showMask
      />
    );
  }
}

//휴대폰번호 Mask
class phoneMaskCustom extends React.Component {
  render() {
    return (
      <MaskedInput
        {...this.props}
        mask={[ /\d/, /\d/, /\d/,'-', /\d/, /\d/,  /\d/,  /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        placeholderChar={'\u2000'}
        //showMask
      />
    );
  }
}

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
}));

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class FullScreenDialog extends React.Component {


  state = {
    open: false,
    employee:{
      account:{
      }
    },
    departOpen:false,
    rankOpen:false,
    flag:false,
    modifyAble:false,
    resignFlag:false
  };

  //인사카드 등록창 열기
  handleClickOpen = () => {
    this.setState({open: true});
  };

  //인사카드 등록창 닫기
  handleClickClose = () => {
    this.setState({
      open:false,
      flag:false,
      modifyAble:false
    })
    this.props.cleanStoreState('HRCardDetailData');
    this.props.cleanStoreState('checkedRankData');
    this.props.cleanStoreState('checkedDepartData')
    this.props.handleModifyHRCardClose();
  }

  handleRequestClose = () => {
    this.setState({open: false});
  };

  handleChange = name => event => {
   
    if(name == 'bankCodeNo' || name == 'accountNo'){

        if(this.state.employee.account == null){
          this.setState({employee:{  ...this.state.employee, 
            account:{
              [name]:event.target.value
            }
          }})
        }else{
          this.setState({employee:{  ...this.state.employee, 
            account:{...this.state.employee.account,
              [name]:event.target.value
            }
          }})
        }
    }else{
      this.setState({ employee:{...this.state.employee,
        [name]: event.target.value,
      }});
    }

  };

  //프로필 사진 업로드
  handleProfileImgUpload = (files) => {
    this.setState({employee:{...this.state.employee,
      profileFile:files}})
  }

  //서명 사진 업로드
  handleSignatureImgUpload = (files) => {
    this.setState({employee:{...this.state.employee,
      signatureFile:files}})
  }

  //우편번호 API로부터 Data받아오기
  handleAddress = (zonecode, fullAddress) => {
      this.setState({
        employee:{...this.state.employee,
          zipCode:zonecode,
          address:fullAddress
        }
      })
  }

  //입사일자 Date Picker로부터 값 받아오기
  handleDatePicker = (date) => {
    this.setState({
      employee:{...this.state.employee,
      joinDate:date}
    })
  }

  //퇴사일자 Date Picker로부터 값 받아오기
  handleResignDatePicker = (date) => {
    this.setState({
      employee:{...this.state.employee,
        resignDate:date}
    })
  }

  //수정 활성화
  handleModifyEnable = () => {
      this.setState({
          modifyAble:true,
      })
  }

   //퇴사여부 Y시
  handleChangeResign = (event) => {
    event.preventDefault();
    if(event.target.value == 'Y'){
      this.setState({
        resignFlag:true,
        employee:{
          ...this.state.employee,
          resignation:event.target.value
        }
      })
    }
    else{
      this.setState({
        resignFlag:false,
        employee:{
          ...this.state.employee,
          resignation:event.target.value,
          resignDate:null,
          resignReason:null
        }
      })
    }
  }

  //Submit
  handleSubmit = () => {
    this.props.updateHRCard(this.state.employee);
    this.handleClickClose()
  }

  render() {


    const { bankList, checkedDepartData, checkedRankData, HRCardDetailData } = this.props;

    console.log(HRCardDetailData)

    if(!this.state.flag && HRCardDetailData && HRCardDetailData !== this.state.employee){
        this.setState({
            employee:HRCardDetailData,
            flag:true,
        })
    }

    if(bankList === undefined){
      this.props.getCodeList({searchKeyword:"bank"});
    }
    if(checkedDepartData && checkedDepartData.codeNo !== this.state.employee.departCodeNo){
      this.setState({
        employee:{
          ...this.state.employee,
          departCodeNo:checkedDepartData.codeNo,
          departCodeName:checkedDepartData.codeName
        }
      })
    }
    if(checkedRankData && checkedRankData.codeNo !== this.state.employee.rankCodeNo){
      this.setState({
        employee:{
          ...this.state.employee,
          rankCodeNo:checkedRankData.codeNo,
          rankCodeName:checkedRankData.codeName
        }
      })
    }

    console.log(this.state)

    return (
      <div>
        <Dialog
          fullScreen
          open={this.props.open}
          onClose={this.handleRequestClose}
          TransitionComponent={Transition}
        >
          <AppBar className="position-relative">
            <Toolbar className="bg-deep-orange">
              <IconButton onClick={this.handleRequestClose} aria-label="Close">
              </IconButton>
              <Typography variant="title" color="inherit" style={{
                flex: 1,
              }}>
                인사카드 상세조회/수정
              </Typography>
              <Button onClick={this.handleClickClose} color="inherit">
                닫기
              </Button>
            </Toolbar>
          </AppBar>
              
          {this.state.employee && (<div  align="center">
          <CardBox styleName="col-lg-8" cardStyle="p-0" headerOutside>
            <AddTextField handleChange={this.handleChange} 
              handleProfileImgUpload={this.handleProfileImgUpload}
              handleSignatureImgUpload={this.handleSignatureImgUpload}
              stateValue={this.state} bankList={bankList}
              employee={this.state.employee}
              handleAddress={this.handleAddress}
              handleDatePicker={this.handleDatePicker}
              handleResignDatePicker={this.handleResignDatePicker}
              checkedDepartment={this.props.checkedDepartment}
              checkedRank={this.props.checkedRank}
              handleChangeResign={this.handleChangeResign}
              />
          </CardBox>
          {!this.state.modifyAble ? (<Button variant="contained" className="jr-btn bg-deep-orange text-white" 
                                        onClick={this.handleModifyEnable} >
                                        수정
                                    </Button>)
                                    :(<Button variant="contained" className="jr-btn bg-deep-orange text-white" 
                                        onClick={this.handleSubmit} >
                                        전송
                                    </Button>)}
          <Button variant="contained" className="jr-btn bg-deep-orange text-white"  
                    onClick={this.handleClickClose}>
              닫기
          </Button>
          </div>)}

        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = ({ code, humanResource }) => {
  const { bankList } = code;
  const { checkedDepartData, checkedRankData, HRCardDetailData} = humanResource;
  return { bankList, checkedDepartData, checkedRankData, HRCardDetailData };
}

export default connect(mapStateToProps, { getCodeList, updateHRCard, checkedDepartment, checkedRank, cleanStoreState })(FullScreenDialog);


//입력창
function AddTextField(props){

    const classes = useStyles();

    const post = React.useRef();
    const signature = React.useRef();

    const[value, setValue] = React.useState({findDepartOpen:false, findRankOpen:false, });

    //부서검색 열기
    const handleFindDepartOpen = () => {
      setValue({findDepartOpen: true});
    }
  
     //부서검색 닫기
    const handleFindDepartClose = () => {
      setValue({findDepartOpen: false});
    }
  
    //직급검색 열기
    const handleFindRankOpen = () => {
      setValue({findRankOpen: true});
    }
  
     //직급검색 닫기
    const handleFindRankClose = () => {
      setValue({findRankOpen: false});
    }

    //입사일자 값 받기
    const callBackDateChange = (_date) => {
      props.handleDatePicker(_date);
    }

    //퇴사일자 값 받기
    const callBackResignDate = (_date) => {
      props.handleResignDatePicker(_date)
    }


    //프로필 파일업로드 화면 열기
    const handleOnClickFileUpload = (e) => {
      document.getElementById('profileInputFile').click();
    }

    //서명 파일업로드 화면 열기
    const handleOnClickSignUpload = (e) => {
      document.getElementById('signatureFile').click();
    }

    //서명도장 다이얼로그 열기
    const handleOnClickSignOpen = () => {
      signature.current.handleRequestOpen();
    }

    //우편번호 창 열기 [ref로 자식 컴포넌트 직접 접근하여 자식컴포넌트의 function을 사용]
    const handlePostOpen = () => {
        post.current.handleClickOpen();
      }

    //상위 Component의 state 값에 profileImage가 저장되어 있으면 가져옴
    const { employee, stateValue } = props;

   


    console.log("-------------------")
    console.log(employee)

    return(
        <div >
          <br/>
          <Typography variant="h4" color="textPrimary" style={{
                flex: 1,
                float:"initial"
              }}>
                  {!stateValue.modifyAble ? "인사카드 상세조회":"인사카드 수정"}
          <br/><br/>
              </Typography>
              <br/>

              <div className="col-md-4 col-6" style={{float:"left"}}>
              <br/><br/>
                <div className="jr-card" style={{width:"160px",height:"150px"}} align="center">
                  <Tooltip id="tooltip-icon" title="Hello" placement="bottom">
                    <Avatar className="size-100" alt="Remy Sharp" 
                            src={employee.profileFile ? `${employee.profileFile.base64}`
                                :(employee.profileImage? 'http://localhost:8080/img/'+employee.profileImage:require("assets/images/noneProfile.png"))}/>
                  </Tooltip>   
                </div>
                <div style={{position:"relative", top:"-25px"}}>
                  <Button variant="contained" color="default" className={classes.button} 
                        onClick={handleOnClickFileUpload} disabled={!stateValue.modifyAble}>
                    프로필사진
                    <CloudUploadIcon className={classes.rightIcon} />
                  </Button>
                </div>               
              </div>              
              <div className="col-md-4 col-6" style={{float:"left", display:"inline"}}>
              <TextField
                      id="employeeName"
                      label="사원명"
                      value={employee.employeeName}
                      onChange={props.handleChange('employeeName')}
                      margin="normal"
                      fullWidth
                      disabled={!stateValue.modifyAble}
                  />
              </div>
              <div className="col-md-4 col-6" style={{float:"left", display:"inline"}}>
                  <FormControl  fullWidth margin="normal" >
                    <InputLabel htmlFor="cardNo">주민등록번호</InputLabel>
                      <Input
                        id="ssn"
                        inputComponent={SsnMaskCustom}
                        value={employee.ssn ? `${employee.ssn}`:''}
                        inputProps={{
                        'aria-label': 'Description',
                        }}
                        onChange={props.handleChange('ssn')}
                        disabled={!stateValue.modifyAble}
                        variant="outlined"
                      />
                  </FormControl>
              </div>
              <div className="col-md-4 col-6" style={{float:"left", display:"inline"}}>
              <DatePicker  label="입사일자" callBackDateChange={callBackDateChange}
                            disabled={!stateValue.modifyAble}
                            value={employee.joinDate}/>            
              </div>

              <div className="col-md-4 col-6" style={{float:"left", display:"inline"}}>
              <TextField
                      id="employeeEmail"
                      label="이메일"
                      value={employee.employeeEmail}
                      onChange={props.handleChange('employeeEmail')}
                      margin="normal"
                      fullWidth
                      disabled={!stateValue.modifyAble}
                  />
              </div>
              <div className="col-md-4 col-6" style={{float:"left", display:"inline"}}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="employeePhone">휴대폰번호</InputLabel>
                      <Input
                        id="employeePhone"
                        inputComponent={phoneMaskCustom}
                        value={employee.employeePhone ? `${employee.employeePhone}`:''}
                        inputProps={{
                        'aria-label': 'Description',
                        }}
                        onChange={props.handleChange('employeePhone')}
                        fullWidth
                        disabled={!stateValue.modifyAble}
                      />
                  </FormControl>
                </div>
              <div className="col-md-4 col-6"  style={{float:"left", display:"inline"}}>
              <TextField
                      id="employeeTel"
                      label="전화번호"
                      value={employee.employeeTel}
                      onChange={props.handleChange('employeeTel')}
                      margin="normal"
                      fullWidth
                      disabled={!stateValue.modifyAble}
                  />
              </div>
            <div className="col-md-4 col-6"  style={{float:"left", display:"inline"}}>
              <TextField
                      id="departCodeName"
                      label="부서"
                    //   onChange={props.handleChange('employeeTel')}
                      onClick={handleFindDepartOpen}
                      value={employee.departCodeName}
                      margin="normal"
                      fullWidth
                      disabled={!stateValue.modifyAble}
                  />
              </div>
              <div className="col-md-4 col-6"  style={{float:"left", display:"inline"}}>
              <TextField
                      id="rankCodeName"
                      label="직급"
                    //   onChange={props.handleChange('employeeTel')}
                      onClick={handleFindRankOpen}
                      value={employee.rankCodeName}
                      margin="normal"
                      fullWidth
                      disabled={!stateValue.modifyAble}
                  />
              </div>
              <div className="col-md-4 col-6" style={{float:"left", display:"inline"}}>
                <TextField
                    id="select-currency"
                    select
                    label="퇴사여부"
                    value={employee && employee.resignation && employee.resignation}
                    // onChange={props.handleChange('resignation')}
                    onChange={props.handleChangeResign}
                    SelectProps={{}}
                    //helperText="급여 받으실 통장을 선택하세요."
                    margin="normal"
                    fullWidth
                    disabled={!stateValue.modifyAble}
                  >
                    <MenuItem value="N">재직</MenuItem>
                    <MenuItem value="Y">퇴사</MenuItem>
                </TextField>
              </div>

              <div className="col-md-4 col-6" style={{float:"left", display:"inline"}}>
              <DatePicker  label="퇴사일자" callBackDateChange={callBackResignDate}
                            value={employee.resignDate}
                            disabled={!stateValue.modifyAble}
                            />            
              </div>

              <div className="col-md-4 col-6"  style={{float:"left", display:"inline"}}>
                <TextField
                        id="resignReason"
                        label="퇴사사유"
                        onChange={props.handleChange('resignReason')}
                        value={employee.resignReason}
                        margin="normal"
                        fullWidth
                        disabled={!stateValue.modifyAble}
                    />
              </div>

            <div className="col-md-4 col-6" style={{float:"left", display:"inline"}}>
              <TextField
                id="select-currency"
                select
                label="급여통장"
                value={employee && employee.account && employee.account.bankCodeNo}
                onChange={props.handleChange('bankCodeNo')}
                SelectProps={{}}
                //helperText="급여 받으실 통장을 선택하세요."
                margin="normal"
                fullWidth
                disabled={!stateValue.modifyAble}
              >
              {props.bankList && props.bankList.map( bankRow => 
                      (<MenuItem value={bankRow.codeNo}>{bankRow.codeName}</MenuItem>)
                    )}
            </TextField>
          </div>

            <div className="col-md-4 col-6" style={{float:"left", display:"inline"}}>
              <TextField
                      id="accountNo"
                      label="계좌번호"
                      value={employee.account.accountNo}
                      onChange={props.handleChange('accountNo')}
                      margin="normal"
                      fullWidth
                      disabled={!stateValue.modifyAble}
                  />
            </div>

            <div className="col-md-4 col-6" style={{float:"left", display:"inline"}}>
              <TextField
                      id="wage"
                      label="시급"
                      value={employee.wage}
                      margin="normal"
                      onChange={props.handleChange('wage')}
                      fullWidth
                      disabled={!stateValue.modifyAble}
                  />
            </div>

            <div style={{display:"none"}}>
            <GetPostCode getPostcode={props.handleAddress} ref={post}></GetPostCode>
            </div>

            <div className="col-md-4 col-6" style={{float:"left", display:"inline", position:'relative', left:"%"}}>
              <TextField
                      id="zipCode"
                      label="우편번호"
                      margin="normal"
                      onClick={handlePostOpen}
                      value={employee.zipCode}
                      fullWidth
                      disabled={!stateValue.modifyAble}
                  />
            </div>

           

            <div className="col-md-4 col-6" style={{float:"left", display:"inline"}}>
              <TextField
                      id="address"
                      label="주소"
                      margin="normal"
                      onClick={handlePostOpen}
                      value={employee.address}
                      fullWidth
                      disabled={!stateValue.modifyAble}
                  />
            </div>

            <div className="col-md-4 col-6" style={{float:"left", display:"inline"}}>
              <TextField
                      id="detailAddress"
                      label="상세주소"
                      value={employee.detailAddress}
                      margin="normal"
                      onChange={props.handleChange('detailAddress')}
                      fullWidth
                      disabled={!stateValue.modifyAble}
                  />
            </div>

            

            <div className="col-md-8 col-12" style={{float:"left", display:"inline"}}>
              <TextField
                      id="refer"
                      label="참조"
                      value={employee.refer}
                      margin="normal"
                      onChange={props.handleChange('refer')}
                      fullWidth
                      disabled={!stateValue.modifyAble}
                  />
            </div>

            <Button variant="contained" size="small" className={classes.button} 
                    onClick={handleOnClickSignOpen} disabled={!stateValue.modifyAble}>
              <SaveIcon className={clsx(classes.leftIcon, classes.iconSmall)} />
              서명/도장
            </Button>


            <div style={{display:"none"}} >
                  프로필 사진
                  <FileBase64 
                    multiple={false}
                    onDone = {props.handleProfileImgUpload}
                    inputId="profileInputFile"
                    />
            </div>

            <div style={{display:"none"}} >
                  도장/서명 사진
                  <FileBase64 
                    multiple={false}
                    onDone = {props.handleSignatureImgUpload}
                    inputId="signatureFile"
                    />
            </div>

            <br/><br/><br/>
            <FindDepart 
              open={value.findDepartOpen} 
              handleSubDepartComponentClose={handleFindDepartClose}
              checkedDepartment={props.checkedDepartment}
              />
            <FindRank 
              open={value.findRankOpen} 
              handleSubRankComponentClose={handleFindRankClose}
              checkedRank={props.checkedRank}
              />
             <SignatureDialog ref={signature} 
                             handleOnClickSignUpload={handleOnClickSignUpload}
                             employee={employee}
                             signatureFile={employee.signatureFile && employee.signatureFile}/>
         
         

        </div>
    );
}

class SignatureDialog extends React.Component {
  state = {
    open: false,
  };

  handleRequestOpen = () => {
    this.setState({open:true});
  }

  handleRequestClose = () => {
    this.setState({open: false});
  };

  render() {
    const classes = makeStyles(theme => ({
      button: {
        margin: theme.spacing(1),
      },
      leftIcon: {
        marginRight: theme.spacing(1),
      },
      rightIcon: {
        marginLeft: theme.spacing(1),
      },
      iconSmall: {
        fontSize: 20,
      },
    }));

    const { signatureFile } = this.props;
    
    return (
      <div>
        <Dialog open={this.state.open} onClose={this.handleRequestClose}>
          <DialogTitle align="center">
            {"서명/사인 등록"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText align="center">
                <div className="jr-card" style={{width:"160px",height:"150px"}} align="center">
                  <Tooltip id="tooltip-icon" title="Hello" placement="bottom">
                    <Avatar className="size-100" alt="Remy Sharp" 
                            src={signatureFile? `${signatureFile.base64}`
                                                 : (this.props.employee.signatureImage? "http://localhost:8080/img/"+this.props.employee.signatureImage
                                                                                        : require("assets/images/stamp.png"))}/>
                  </Tooltip>   
                </div>
                  <Button variant="contained" color="default" className={classes.button} 
                      onClick={this.props.handleOnClickSignUpload} >
                    서명/도장
                    <CloudUploadIcon className={classes.rightIcon} />
                  </Button>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRequestClose} color="primary">
              확인
            </Button>
            <Button onClick={this.handleRequestClose} color="secondary">
              취소
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}