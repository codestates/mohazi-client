import { withRouter } from "react-router-dom";
import styled from 'styled-components';

const Page = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 0px;

    > img {
        height: 100vh;
        margin: -20px 0 0 0;
    }
`;

function NotFoundPage() {
    return (
        <Page>
            <img src='img/pablo-956.png'></img>
        </Page>
    )
}

export default withRouter(NotFoundPage);