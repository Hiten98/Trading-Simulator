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

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currencyList: ["a", "b", "c"],
      myCurrencyList: ["a"],
      currA: "",
      currB: "",
      valAmt: 0.0
    };
  }

  onAmountChange = event => {
    if (event.target.value < 0) {
      this.setState({
        valAmt: 0
      });
    } else {
      this.setState({
        valAmt: event.target.value
      });
    }
  };

  handleInputA = event => {
    console.log(event);
    this.setState({
      currA: event
    });
  };

  handleInputB = event => {
    console.log(event);
    this.setState({
      currB: event
    });
  };

  getInfo = () => {
    let obj = {
        currA: this.state.currA,
        currB: this.state.currB,
        amount: this.state.valAmt
    }
    return obj;
}

  render() {
    let currencies = [];
    for (let c in this.state.currencyList) {
      currencies.push(
        <option value={this.state.currencyList[c]}>
          {this.state.currencyList[c]}
        </option>
      );
    }
    let myCurrencies = [];
    for (let c in this.state.myCurrencyList) {
      myCurrencies.push(
        <option value={this.state.myCurrencyList[c]}>
          {this.state.myCurrencyList[c]}
        </option>
      );
    }

    return (
      <Row>
        <Col className="cardCol">
          <Card style={{ display: "inline-flex", padding: "2vh" }}>
            <CardText>
              <Form style={{ display: "inline-flex" }}>
                <FormGroup>
                  <Input
                    type="select"
                    name="select"
                    id="buysell"
                    onChange={e => this.handleInputA(e.target.value)}
                  >
                    {myCurrencies}
                  </Input>
                </FormGroup>
                <FaArrowRight
                  size={20}
                  style={{
                    marginTop: "1.5vmin",
                    marginLeft: "2vmin",
                    marginRight: "2vmin"
                  }}
                />
                <FormGroup>
                  <Input
                    type="select"
                    name="select"
                    id="currency"
                    onChange={e => this.handleInputB(e.target.value)}
                  >
                    {currencies}
                  </Input>
                </FormGroup>
              </Form>
            </CardText>
            <CardText style={{ display: "inline-flex" }}>
              <Input
                placeholder="Amount"
                type="number"
                step="0.01"
                value={this.state.valAmt}
                onChange={this.onAmountChange}
              />
            </CardText>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Main;
