import { withRouter, Route, useHistory } from "react-router-dom";

function Header() {
    const history = useHistory();
    return (
        <div> Header </div>
    )
}

export default withRouter(Header);