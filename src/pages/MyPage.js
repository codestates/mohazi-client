import { withRouter, Route, useHistory } from "react-router-dom";

function MyPage() {
    const history = useHistory();
    return (
        <div> MyPage </div>
    )
}

export default withRouter(MyPage);