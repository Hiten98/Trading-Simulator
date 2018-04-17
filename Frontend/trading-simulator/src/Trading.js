import React, { Component } from "react";
import "./App.css";
import "./Trading.css";
import FaArrowRight from "react-icons/lib/fa/arrow-right";
import {
  Container,
  Row,
  Col,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import MyCard from "./MyCards";

class Main extends Component {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      numItems: 1,
      currencyList: ["a", "b", "c"],
      myCurrencyList: ["a"],
      transactionCards: []
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  handleAdd = () => {
    this.setState({
      numItems: this.state.numItems + 1
    }, () => this.componentDidMount());
  };

  handleRemove = () => {
    if (this.state.numItems > 1) {
      this.setState({
        numItems: this.state.numItems - 1
      }, () => this.componentDidMount());
    }
  };


  submitTransaction = () => {
      for(let card in this.state.transactionCards) {
          card.getInfo();
      }
  }

  componentDidMount = () => {
    let cards = [];
    for (let i = 0; i < this.state.numItems; i++) {
      cards.push(
        <MyCard />
      );
    }
    this.setState({transactionCards: cards})
  }

  render() {
    return (
      <div className="whole">
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/" className="mr-auto">
            Algorithmic Trading Simulator
          </NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/trading/">Trading</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/profile/">Profile</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/logout/">Logout</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Container className="whole">
          <Row>
            <Col>
              <h3>Create Transaction</h3>
            </Col>
          </Row>
          {this.state.transactionCards}
          <Row style={{ marginBottom: "2vh" }}>
            <Col className="cardCol">
              <Button color="danger" onClick={() => this.handleRemove()}>
                Remove
              </Button>{" "}
              <Button color="success" onClick={() => this.handleAdd()}>
                Add
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button style={{ margin: "1vmin" }} onClick={() => this.submitTransaction()}>Submit</Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Main;
