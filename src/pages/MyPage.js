import { withRouter, Route, useHistory } from "react-router-dom";
import styled, { keyframes } from 'styled-components';

function MyPage() {
    const history = useHistory();
    return (
        <div>Mypage</div>
    )
}

export default withRouter(MyPage);