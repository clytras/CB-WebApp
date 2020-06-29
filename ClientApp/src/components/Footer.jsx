import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Container } from 'reactstrap';
import Markdown from '@components/common/Markdown';
import { Strings } from '@i18n';


export default function Footer() {
  return (
    <footer>
      <Container>
        <Row className="footer-nav">
          <Col className="info">
            <a href="https://www.certh.gr" target="_blank" rel="noopener noreferrer"><img src="/assets/Certh-Logo_en_alpha.png" alt="CeRTH Logo"/></a>
            <a href="https://www.imet.gr/index.php/en" target="_blank" rel="noopener noreferrer"><img src="/assets/HIT-Logo_en.png" alt="HIT Logo"/></a>
          </Col>
          <Col className="links">
            <p><Link to="/">Privacy Policy</Link></p>
            <p><Link to="/">Terms of Service</Link></p>
          </Col>
        </Row>
      </Container>
      <div className="copyright text-center py-3">
        <Markdown source={Strings.Content.FooterCopyright} />
      </div>
    </footer>
  );
}
