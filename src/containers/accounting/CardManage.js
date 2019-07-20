import React from "react";
import { connect } from 'react-redux';
import { getCardList } from "actions/index";
import CardBox from "components/CardBox";
import GetCardList from 'components/accounting/GetCardList';

class CardManage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            search : 
                { searchKeyword : " " }
        }
        
    }

    render() {
        
        const { cardList } = this.props;
        
        if(cardList === undefined) {
            this.props.getCardList(this.state.search);
        }

        return (
            <CardBox styleName="col-lg-13" cardStyle="p-0" headerOutside>
                {cardList !== undefined ?(<GetCardList cardList={cardList}></GetCardList>) : "error" }
            </CardBox>
        )
    }
}//end of class

    const mapStateToProps = ({accounting}) => {
        const { cardList } = accounting;
        return { cardList };
    }

export default connect( mapStateToProps, { getCardList })(CardManage);