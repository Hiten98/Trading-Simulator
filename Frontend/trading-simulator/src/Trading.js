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
import history from "./history";
import MyCard from "./MyCards";

class Main extends Component {
  constructor(props) {
    super(props);

    console.log(props.match.params.jwt);
    if(props.match.params.jwt == null || props.match.params.jwt == "") {
      history.push("/login");
    }
    this.child = React.createRef();
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      jwt: props.match.params.jwt,
      numItems: 1,
      cardStates: [],
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

  handleCardState = (index, singleState) => {
    let oldStates = this.state.cardStates;
    oldStates[index] = singleState;
    this.setState({
      cardStates: oldStates
    })
  }

  submitTransaction = () => {
    console.log(this.state.cardStates);
  }

  componentDidMount = () => {
    let cards = [];
    for (let i = 0; i < this.state.numItems; i++) {
      cards.push(
        <MyCard handleCardState={this.handleCardState} myKey={i}/>
      );
    }
    this.setState({transactionCards: cards})
  }

  render() {
    return (
      <div>
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
