import { withRouter, Route, useHistory } from "react-router-dom";

function SearchPage() {
    const history = useHistory();
    return (
        <div> SearchPage </div>
    )
}

export default withRouter(SearchPage);