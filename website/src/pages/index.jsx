import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styled from 'styled-components';
import Layout from '@theme/Layout';

import {Home} from '../components';
import HeaderMap from 'website-examples/homepage-header/src/app';

const HeroExampleScrim = styled.div`
  background-image: linear-gradient(
    90deg,
    rgb(0, 0, 0, 0.15) 0,
    rgb(0, 0, 0, 0) 50%
  );
  height: 100%;
`;

const HeroExample = () => {
  return (
    <>
      <HeroExampleScrim />
      <HeaderMap />
    </>
  );
};

const TextContainer = styled.div`
  max-width: 800px;
  padding: 64px 112px;
  width: 70%;
  font-size: 14px;

  h2 {
    font-size: 2em;
    font-weight: bold;
    line-height: 1.5;
    margin: 24px 0 16px;
    position: relative;

    @media (max-width: 760px) {
      font-size: 1.4em;
    }
  }
  h3 {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.5;
    margin: 16px 0 0;
    position: relative;
  }
  h3 > img {
    position: absolute;
    top: -4px;
    width: 36px;
    left: -48px;
  }
  hr {
    border: none;
    background: #e1e8f0;
    margin: 24px 0 0;
    width: 32px;
    height: 2px;
  }
  @media screen and (max-width: 768px) {
    max-width: 100%;
    width: 100%;
    padding: 48px 48px 48px 80px;
  }
`;

export default function IndexPage() {
  const baseUrl = useBaseUrl('/');

  return (
    <Layout title="Home" description="react-google-maps">
      <Home HeroExample={HeroExample}>
        <div style={{position: 'relative'}}>
          <TextContainer>
            <h2>
              react-google-maps makes using the Google Maps JavaScript API in
              React applications easy.
            </h2>
            <hr className="short" />

            <h3>
              <img src={`${baseUrl}images/icon-react.svg`} />
              React Integration
            </h3>
            <p>
              Use a Google map as a fully controlled reactive component and use
              all the other features of the Google Maps JavaScript API.
            </p>

            <h3>
              <img src={`${baseUrl}images/icon-layers.svg`} />
              Extensible
            </h3>
            <p>
              Includes components and hooks to make writing custom components
              easy.
            </p>

            <h3>
              <img src={`${baseUrl}images/icon-high-precision.svg`} />
              Part of vis.gl's Framework Suite
            </h3>
            <p>
              Use together with e.g.{' '}
              <a
                href="https://deck.gl/"
                target="_blank"
                rel="noopener noreferrer">
                deck.gl
              </a>{' '}
              to render performant and compelling 2D and 3D WebGL visualizations
              on top of your maps.
            </p>
          </TextContainer>
        </div>
      </Home>
    </Layout>
  );
}
