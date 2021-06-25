import { withRouter, Route, useHistory } from "react-router-dom";

function LandingPage() {
    const history = useHistory();
    return (
        <div> LandingPage </div>
    )
}

export default withRouter(LandingPage);