import React, { Component } from "react";
import "./App.css";
import axios from "axios";
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
  InputGroupAddon,
  Table
} from "reactstrap";
import history from "./history";

axios.defaults.baseURL = "http://52.14.66.192:9090";

class Graphs extends Component {
  constructor(props) {
    super(props);
    console.log(props.match);
    let currency1 = props.match.params.currency;
    if (
      props.match.params.currency == null ||
      props.match.params.currency == ""
    ) {
      history.push("/login");
    }
    let jwt1 = props.match.params.jwt;
    if (props.match.params.jwt == null || props.match.params.jwt == "") {
      jwt1 = "";
    }

    this.state = {
      jwt: jwt1,
      collapsed: true,
      currency: currency1
    };
  }

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  componentDidMount = () => {
    axios
      .post("/GET-GRAPH-VALUES", {
        currency: this.state.currency
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    let nav;
    if (
      this.props.match.params.jwt == null ||
      this.props.match.params.jwt == ""
    ) {
      nav = (
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink href="/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/login/">Login</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/register/">Register</NavLink>
          </NavItem>
        </Nav>
      );
    } else {
      nav = (
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink href={"/" + this.state.jwt}>Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href={"/trading/" + this.state.jwt}>Trading</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href={"/profile/" + this.state.jwt}>Profile</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/logout/">Logout</NavLink>
          </NavItem>
        </Nav>
      );
    }

    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/" className="mr-auto">
            Algorithmic Trading Simulator
          </NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse isOpen={!this.state.collapsed} navbar>
            {nav}
          </Collapse>
        </Navbar>

        <Row
          style={{
            paddingLeft: "10vmin",
            paddingRight: "10vmin",
            paddingTop: "2vmin",
            paddingBottom: "5vmin"
          }}
        >
          <Col>
            <h3>{this.state.currency}</h3>
            <Table bordered responsive style={{ marginTop: "2vmin" }}>
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Value</th>
                  <th>Percent Change</th>
                  <th>Volatility</th>
                </tr>
              </thead>
              <tbody>{this.state.tableVals}</tbody>
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Graphs;
