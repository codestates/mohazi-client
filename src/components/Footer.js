import { withRouter, Route, useHistory } from "react-router-dom";

function Footer() {
    const history = useHistory();
    return (
        <div> Footer </div>
    )
}

export default withRouter(Footer);