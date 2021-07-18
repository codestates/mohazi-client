import { withRouter, Route, useHistory } from "react-router-dom";
import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import { Link } from 'react-router-dom';

const FixPosition = styled.div`
    display: flex;
    flex-direction: column;
    bottom: 0px;
    width: 100%;
`;

const Background = styled.div`
    background: white;
    display: flex;
    justify-content: center;
    height: auto;
`;

const FooterContents = styled.div`
    width: 1200px;
    height: 170px;
    display: flex;
    flex-direction: row;
    align-items: top;

    padding-right: 1rem;
    padding-left: 1rem;
`;

const ContentCategory = styled.div`
    font-weight: 600;
    color: ${oc.gray[8]};
    flex-direction: column;
    align-items: left;
    font-size: 1.2rem;
    padding: 1rem;
    padding-left: 3rem;
`;
const Content = styled.div`
    font-size: 0.5rem;
    font-weight: 400;
    font-size: 0.9rem;
    padding-top: 1rem;
`;

const ContentLink = styled.a`
    text-decoration: none;
    color: ${oc.gray[8]};
    font-size: 0.9rem;
    line-height: 1.8;

    &:hover {
        color: ${oc.blue[6]};
    }
`;

function Footer() {
    return (
        <FixPosition>
            <Background>
                <FooterContents>
                    <ContentCategory>About us<br/>
                        <Content>
                            <ContentLink href="https://github.com/codestates/mohazi-client/wiki">Wiki</ContentLink><br/>
                            <ContentLink href="https://github.com/codestates/mohazi-client">Repository</ContentLink><br/>
                        </Content>
                    </ContentCategory>
                    <ContentCategory>Created by<br/>
                        <Content>
                            Hyehyun Kim <ContentLink href="https://github.com/franhhk">@github</ContentLink><br/>
                            Hyunjun Kim <ContentLink href="https://github.com/boltang2">@github</ContentLink><br/>
                            Junghyun Jo <ContentLink href="https://github.com/whThswh">@github</ContentLink><br/>
                            Jihoon Baek <ContentLink href="https://github.com/hoon6653">@github</ContentLink><br/>
                        </Content>
                    </ContentCategory>
                </FooterContents>
            </Background>
        </FixPosition>
    )
}

export default withRouter(Footer);