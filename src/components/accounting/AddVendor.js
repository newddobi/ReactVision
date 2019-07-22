import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import CardBox from 'components/CardBox';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { addVendor, getCodeList } from 'actions/index';
import GetPostCode from 'components/accounting/GetPostCode'

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

//import할 이름은 alias니 내 마음대로 이름을 바꿔도됨
class AddVendor extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({open: true});
  };

  handleRequestClose = () => {
    this.setState({open: false});
  };

  render() {

    const { bankList, vendorList } = this.props;
    if(bankList === undefined){
      this.props.getCodeList({ searchKeyword : "bank" });
      this.props.getCodeList({ searchKeyword : "vendor" });
    }

    return (
      <div>
        <Button variant="contained" className="jr-btn bg-deep-orange text-white" onClick={this.handleClickOpen}>
            등록
        </Button>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleRequestClose}
          TransitionComponent={Transition}
        >
          <AppBar className="position-relative">
            <Toolbar className="bg-deep-orange">
              <Typography variant="title" color="inherit" style={{
                flex: 1,
              }}>
                거래처 등록
              </Typography>
              <Button onClick={this.handleRequestClose} color="inherit">
                닫기
              </Button>
            </Toolbar>
          </AppBar>
          
          <p/>
            
          <div align="center">  
            <CardBox styleName="col-lg-4" heading="거래처 등록">
              <AddTextFields 
                bankCodeList={ bankList } 
                vendorCodeList={ vendorList } 
                handleRequestClose={this.handleRequestClose }
                addVendor={this.props.addVendor }/>
            </CardBox>
          </div>
          
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = ({code}) => {
  const { bankList, vendorList } = code;
  return { bankList, vendorList };
}

export default connect(mapStateToProps, {addVendor, getCodeList})(AddVendor);

//입력창
function AddTextFields(props) {
  
  //const 선언시에는 []가 필요하지만, 값을 대입할때는 다 받기때문에 안써도 무방하다.
  //const는 뒤에 오는 값을 알아서 판별해서 대입하기 때문에 다 받을 수 있다.
  const vendorList = props.vendorCodeList;
  const bankList = props.bankCodeList;
  
  //Hook이란 특별한 함수, useState는 Hook 중 하나인데 state를 함수 컴포넌트에서 사용할 수 있게 해준다.
  //Hook은 함수 컴포넌트에서 React의 특징을 갖게 해주는 함수. Hook은 항상 use라는 키워드로 시작
  //useState를 사용해서 values라는 변수를 선언한다. useState의 인자로 넘기는 것은 state의 초기값.
  //useState는 state 변수, 해당 변수를 갱신할 수 있는 함수 두 가지 쌍을 반환한다.
  //대괄호를 사용하는 문법은 "배열 구조 분해" 왼쪽의 변수는 사용하고 싶은 이름으로 변경가능. 배열구조분해라는 특별한 방법으로 변수를
  //선언해주었기 때문에 [0]이나 [1]로 배열에 접근하는 것은 좋지 않다.
  const [values, setValues] = useState({
    vendorName:"",
    representativeName:"",
    vendorTel:"",
    vendorPhone:"",
    vendorCategoryCodeNo:"",
    //도메인 안에 도메인에 값을 넣으려면 그냥 보내면 안되고 inner json으로 보내야 한다.
    vendorAccount :{
      bankCodeNo:"",
      accountNo:"",
      accountHolder:""
    },
    zipCode:"",
    address:"",
    detailAddress:""
  });

  //inner json을 입력하려면 우선 임시방편으로 else if로 사용해서 직접 nested json에 넣는 수 밖에 없을듯
  const handleChange = name => event => {
    if(name === 'bankCodeNo'){
      setValues({...values, vendorAccount:{...values.vendorAccount, [name]:event.target.value}})
    }else if(name === 'accountNo'){
      setValues({...values, vendorAccount:{...values.vendorAccount, [name]:event.target.value}})
    }else if(name === 'accountHolder'){
      setValues({...values, vendorAccount:{...values.vendorAccount, [name]:event.target.value}})
    }else{
      setValues({ ...values, [name]: event.target.value });

    }
    console.log(values);
  };

  const handlePostcode = (zipCode, address) => {
    setValues({
      ...values,
      zipCode:zipCode,
      address:address
    })
  };

  const submitFn = () => {
      props.addVendor(values);
      props.handleRequestClose();
  }

    return (
      <form className="row" noValidate autoComplete="off">
        <div className="col-md-12 col-12">
          <TextField
            id="vendorName"
            label="거래처명"
            placeholder="거래처명"
            value={values.vendorName}
            onChange={handleChange('vendorName')}
            margin="normal"
            fullWidth
          />
        </div>
        <div className="col-md-12 col-12">
          <TextField
            id="representativeName"
            label="대표자명"
            placeholder="대표자명"
            value={values.representativeName}
            onChange={handleChange('representativeName')}
            margin="normal"
            fullWidth
          />
        </div>
        <div className="col-md-12 col-12">
          <TextField
            id="vendorTel"
            label="거래처 전화번호"
            placeholder="거래처 전화번호"
            value={values.vendorTel}
            onChange={handleChange('vendorTel')}
            margin="normal"
            fullWidth
          />
        </div>
        <div className="col-md-12 col-12">
          <TextField
            id="vendorPhone"
            label="거래처 휴대폰번호"
            placeholder="거래처 휴대폰번호"
            value={values.vendorPhone}
            onChange={handleChange('vendorPhone')}
            margin="normal"
            fullWidth
          />
        </div>

        <div className="col-md-6 col-6">
          <GetPostCode getPostcode={ handlePostcode }/>
        </div>

        <div className="col-md-6 col-6">
          <TextField
            id="zipCode"
            label="우편번호"
            placeholder="우편번호"
            value={values.zipCode}
            onChange={handleChange('zipCode')}
            margin="normal"
            fullWidth
          />

        </div>
          <div className="col-md-12 col-12">
          <TextField
            id="address"
            label="주소"
            placeholder="주소"
            value={values.address}
            onChange={handleChange('address')}
            margin="normal"
            fullWidth
          />
        </div>
        
        <div className="col-md-12 col-12">
          <TextField
            id="detailAddress"
            label="상세주소"
            placeholder="상세주소"
            value={values.detailAddress}
            onChange={handleChange('detailAddress')}
            margin="normal"
            fullWidth
          />
        </div>

        <div className="col-md-12 col-12">
          <TextField
            id="vendorCategoryCodeNo"
            select
            label="거래처 분류"
            value={values.vendorCategoryCodeNo}
            onChange={handleChange('vendorCategoryCodeNo')}
            SelectProps={{}}
            helperText="거래처를 분류해 주세요"
            margin="normal"
            fullWidth
          >
            {vendorList.map(option => (
              <MenuItem key={option.codeNo} value={option.codeNo}>
                {option.codeName}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="col-md-12 col-12">
          <TextField
            id="bankCodeNo"
            select
            label="은행 선택"
            value={values.vendorAccount.bankCodeNo}
            onChange={handleChange('bankCodeNo')}
            SelectProps={{}}
            helperText="은행을 선택해 주세요"
            margin="normal"
            fullWidth
          >
            {bankList.map(option => (
              <MenuItem key={option.codeNo} value={option.codeNo}>
                {option.codeName}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="col-md-12 col-12">
          <TextField
            id="accountNo"
            label="계좌번호"
            placeholder="계좌번호"
            value={values.vendorAccount.accountNo}
            onChange={handleChange('accountNo')}
            margin="normal"
            fullWidth
          />
        </div>
        <div className="col-md-12 col-12">
          <TextField
            id="accountHolder"
            label="예금주명"
            placeholder="예금주명"
            value={values.vendorAccount.accountHolder}
            onChange={handleChange('accountHolder')}
            margin="normal"
            fullWidth
          />
        </div>
     
        <div className="col-md-12 col-12">
          <Button className="jr-btn text-uppercase btn-block" color="default" onClick={() => {submitFn()}}>등록하기</Button>
        </div>
        
      </form>
    );
  
}
