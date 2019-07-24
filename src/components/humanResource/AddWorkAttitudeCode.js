import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { checkedEmployee
        , checkedDepartment
        , checkedRank
        , addAppointment
        , checkedWorkAttitudeCode
        , addWorkAttitude
        , addWorkAttitudeCode } from 'actions/index';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import TimePicker from 'components/time/TimePickers';


class FormDialog extends React.Component {
  state = {
    open: false,
    subOpen: false,
    workAttitudeCodeOpen: false,
    btnShow: true,
    commuteApplyTextfield: false,
    checkedAll:false,
    checkedDay:false,
    checkedSaturday:false,
    checkedSunday:false,
    duplicate:false,
  };

  handleClickOpen = () => {
    this.setState({open: true,
                 workAttitudeCode:{...this.state.workAttitudeCode, commuteApplyCode:"01"}});
  };

  handleRequestClose = () => {
    this.setState({
                  open: false
                  ,btnShow: true
                  ,commuteApplyTextfield: false
                  ,checkedAll:false
                  ,checkedDay:false
                  ,checkedSaturday:false
                  ,checkedSunday:false
                  ,workAttitudeCode:null
                  ,duplicate:false});
  };


  handleChange = name => event => {
      this.setState({workAttitudeCode:{...this.state.workAttitudeCode, [name]:event.target.value}});
  }

  //출퇴근기록반영 TextField 보여주기
  handleCommuteApplyShow  = () => {
      this.setState({
        btnShow: false,
        commuteApplyTextfield: true,
        workAttitudeCode:{...this.state.workAttitudeCode, commuteApplyCode:"02"}
      })
    }

  //반영요일 체크박스
  checkworkDayOfWeek = (name) =>  {
      if(name == 'checkedAll'){
        if(this.state.checkedAll){
          this.setState({
            checkedAll:false,
            checkedDay:false,
            checkedSaturday:false,
            checkedSunday:false
          })
        }else{
          this.setState({
            checkedAll:true,
            checkedDay:true,
            checkedSaturday:true,
            checkedSunday:true
          })
        }
      }
      else if(name == 'checkedDay'){
        if(this.state.checkedSaturday && this.state.checkedSunday){
          this.checkworkDayOfWeek('checkedAll');
        }else{
          this.setState({
                  checkedDay:this.state.checkedDay? false:true,
          })
        }
      }
      else if(name == 'checkedSaturday'){
        if(this.state.checkedDay && this.state.checkedSunday){
          this.checkworkDayOfWeek('checkedAll');
        }else{
          this.setState({
            checkedSaturday:this.state.checkedSaturday? false:true
          })
        }
      }
      else if(name == 'checkedSunday'){
        if(this.state.checkedDay && this.state.checkedSaturday){
          this.checkworkDayOfWeek('checkedAll');
        }else{
          this.setState({
            checkedSunday:this.state.checkedSunday? false:true
          })
        }
      }
  }

  //Date로부터 시작시간 받아오기
  handleChangeStartTime = (date) => {
    this.setState({workAttitudeCode:{...this.state.workAttitudeCode, applyStartTime:date}})
  }

  //Date로부터 종료시간 받아오기
  handleChangeEndTime = (date) => {
    this.setState({workAttitudeCode:{...this.state.workAttitudeCode, applyEndTime:date}})
  }

  //근태코드 중복체크 비동기 요청
  handleDuplicateCheckReq = async (_data) => {
    return await axios({
      method:"GET",
      url:"/hr/getWorkAttitudeCodeDetail/"+_data
    })
    .then(response => response.data)
    .catch(error => console.log(error))
  }

  //근태코드 중복체크
  handleDuplicate = (event) => {
    var target = event.target.value;
    var values = this.handleDuplicateCheckReq(target);
    values.then(data => data ? 
        this.setState({duplicate:true, workAttitudeCode:{...this.state.workAttitudeCode, workAttitudeCodeNo:target}})
        :this.setState({duplicate:false, workAttitudeCode:{...this.state.workAttitudeCode, workAttitudeCodeNo:target}}))
  }

 
  render() {

   console.log(this.state)

    const handleSubmit = () => {
      if(this.state.workAttitudeCode.workAttitudeCodeNo === undefined){
        alert("근태코드를 반드시 입력하세요.")
      }
      else if(this.state.duplicate){
        alert("중복된 근태코드는 등록할 수 없습니다.")
      }
      else if(this.state.workAttitudeCode.workAttitudeCodeName === undefined){
        alert("근태명칭을 반드시 입력하세요.")
      }
      else{

        var values;

        if(this.state.checkedAll){
          values = Object.assign({}, this.state.workAttitudeCode, {workDayOfWeek:"01"});
        }
        else if(this.state.checkedDay){
          if(this.state.checkedSaturday){
            values = Object.assign({}, this.state.workAttitudeCode, {workDayOfWeek:"03"});
          }
          else if(this.state.checkedSunday){
            values = Object.assign({}, this.state.workAttitudeCode, {workDayOfWeek:"04"});
          }
          else{
            values = Object.assign({}, this.state.workAttitudeCode, {workDayOfWeek:"05"});
          }
        }
        else if(this.state.checkedSaturday){
          if(this.state.checkedSunday){
            values = Object.assign({}, this.state.workAttitudeCode, {workDayOfWeek:"06"});
          }
        }
        else if(this.state.checkedSunday){
          values = Object.assign({}, this.state.workAttitudeCode, {workDayOfWeek:"07"});
        }

        this.props.addWorkAttitudeCode(values);
        // this.setState({
        //   checkedAll:false,
        //   checkedDay:false,
        //   checkedSaturday:false,
        //   checkedSunday:false,
        //   workAttitudeCode:null
        // });
        console.log(values)
        this.handleRequestClose();
      }
    }
  
    return (
      <div>
        <Button variant="contained" className="jr-btn bg-deep-orange text-white" onClick={this.handleClickOpen}>
            등록
        </Button>
        <Dialog open={this.state.open} onClose={this.handleRequestClose} maxWidth="xl">
          <DialogTitle>근태코드 등록</DialogTitle>
          <DialogContent >
            <DialogContentText>
              근태코드에 출퇴근시간 반영을 원하시면 출퇴근기록반영 버튼을 누르시길 바랍니다.
            </DialogContentText>

            <div >
            &nbsp;
            <TextField
              margin="none"
              id="workAttitudeCodeNo"
              label="근태코드"
              value={this.state.workAttitudeCode && this.state.workAttitudeCode.workAttitudeCodeNo}
              onChange={this.handleDuplicate}
              //onChange={this.handleChange("workAttitudeCodeNo")}
              helperText={this.state.duplicate? "중복입니다.":""}
              fullWidth
            />
            </div>
            <div >
            &nbsp;
            <TextField
              margin="none"
              id="workAttitudeCodeName"
              label="근태명칭"
              value={this.state.workAttitudeCode && this.state.workAttitudeCode.workAttitudeCodeName}
              onChange={this.handleChange('workAttitudeCodeName')}
              fullWidth
            />
            </div>
            <br/>
            <Button variant="contained" color="primary" 
                    className="jr-btn jr-btn-sm" style={{display:this.state.btnShow ? 'block':'none'}}
                    onClick={this.handleCommuteApplyShow}>
              출퇴근기록반영
            </Button>

            <div style={{display:this.state.commuteApplyTextfield ? 'block':'none'}}>
                <FormControl component="fieldset" required>
                  <FormLabel component="legend">반영방식</FormLabel>
                  <RadioGroup
                    className="d-flex flex-row"
                    aria-label="workType"
                    name="workType"
                    value={this.state.value}
                    onChange={this.handleChange('workType')}
                  >
                    <FormControlLabel value="01" control={<Radio color="primary"/>} label="정상근무"/>
                    <FormControlLabel value="02" control={<Radio color="primary"/>} label="연장근무"/>
                  </RadioGroup>
                </FormControl>
            
              <hr/>

              <div>
              <FormHelperText className="text-grey">반영요일</FormHelperText>
              <FormGroup className="d-flex flex-row" >
                <FormControlLabel
                  control={
                    <Checkbox color="primary"
                              checked={this.state.checkedAll}
                              onClick={event => { event.preventDefault(); this.checkworkDayOfWeek('checkedAll')}}
                              value="all"
                    />
                  }
                  label="전체"
                />
                
                <FormControlLabel
                  control={
                    <Checkbox color="primary"
                              checked={this.state.checkedDay}
                              onClick={event => { event.preventDefault(); this.checkworkDayOfWeek('checkedDay')}}
                              value="day"
                    />
                  }
                  label="평일"
                />
                <FormControlLabel
                  control={
                    <Checkbox color="primary"
                              checked={this.state.checkedSaturday}
                              onClick={event => { event.preventDefault(); this.checkworkDayOfWeek('checkedSaturday')}}
                              value="saturday"
                    />
                  }
                  label="토요일"
                />
                <FormControlLabel
                  control={
                    <Checkbox color="primary"
                              checked={this.state.checkedSunday}
                              onClick={event => { event.preventDefault(); this.checkworkDayOfWeek('checkedSunday')}}
                              value="sunday"
                    />
                  }
                  label="일요일"
                />
              </FormGroup>
            </div>
            <br/>
            <TimePicker label="시작시간" handleChangeTime = {this.handleChangeStartTime}></TimePicker>
            <br/>
            <TimePicker label="종료시간" handleChangeTime = {this.handleChangeEndTime}></TimePicker>
          </div>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmit} color="secondary">
              확인
            </Button>
            <Button onClick={this.handleRequestClose} color="primary">
              취소
            </Button>
          </DialogActions>
        </Dialog>


      </div>
    );
  }
}


export default connect(null, { addWorkAttitudeCode })(FormDialog);
