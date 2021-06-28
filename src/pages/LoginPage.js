import { withRouter, Route, useHistory } from "react-router-dom";

function LoginPage() {
    const history = useHistory();
    return (
        <div> LoginPage </div>
    )
}

export default withRouter(LoginPage);