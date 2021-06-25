import { withRouter, Route, useHistory } from "react-router-dom";

function ShowDetailPage() {
    const history = useHistory();
    return (
        <div> ShowDetailPage </div>
    )
}

export default withRouter(ShowDetailPage);