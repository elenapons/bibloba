import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootswatch/dist/cosmo/bootstrap.css";
import "antd/dist/antd.css";
import bilobaImg from "./biloba.jpg";
import libraryBackground from "./zigzag.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Layout,
    Menu
  } from 'antd';
import { faSearch, faSpinner, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import {
    Switch,
    Route,
    NavLink
  } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    Button,
    Table,
    Container,
    Row,
    Col } from 'reactstrap';

export {
    App
};

function App2() {
    return (
        <div className = "container">
            <Navbar color="light" light expand="md">
            {/* <NavbarBrand href="/">BIBLOBA</NavbarBrand> */}
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/home">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/myLibrary">My Library</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="Community">Community</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="About">About</NavLink>
              </NavItem>
            </Nav>
            </Navbar>
            <h1>BIBLOBA</h1>
            <h2>The Community Library</h2>
            <Switch>
                <Route exact path='/Home' component={Home}/>
                <Route path='/mylibrary' component={MyLibrary}/>
            </Switch>
        </div>
    );
}

function App() {
    return (
        <Layout>
            <Layout.Header>
                <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
                    <Menu.Item>
                        <NavLink to="/home">Home</NavLink>
                    </Menu.Item>
                    <Menu.Item>
                        <NavLink to="/myLibrary">My Library</NavLink>
                    </Menu.Item>
                    <Menu.Item>
                        <NavLink to="/Community">Community</NavLink>
                    </Menu.Item>
                    <Menu.Item>
                        <NavLink to="/About">About</NavLink>
                    </Menu.Item>
                </Menu>
            </Layout.Header>
            <Layout.Content>
                <h1>BIBLOBA</h1>
                <h2>The Community Library</h2>
                <Switch>
                    <Route exact path='/Home' component={Home}/>
                    <Route path='/mylibrary' component={MyLibrary}/>
                </Switch>
            </Layout.Content>
        </Layout>
    );
}

function Home() {
    return (
        <div>
            <img src={bilobaImg} style={bilobaStyle} alt="Ginko, Jean-Pierre Chéreau and Roger Culos"/>
            <div className = "searchbox col-md-4 col-sm-8 col-md-offset-1">
                <form className ="form-inline" style={searchStyle}>
                <input className ="form-control" type="text" placeholder="Search..."/>
                    <button className ="btn btn-default" type="submit"><FontAwesomeIcon icon={faSearch}/></button>
                </form>
            </div>
        </div>
    );
}
class MyLibrary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoadingStatus: "pending",
        }
    }
    componentDidMount() {
        fetch('http://localhost:3000/api/readers/5b7033906aab112a9ed07285/libraries?filter[include]=books')
            .then(response => response.json())
            .then(jsonResponse => this.setState({
                dataLoadingStatus: "ok",
                libraries: jsonResponse,
            }))
    }
    render(){
        return (
            <Container>
                {
                    this.state.dataLoadingStatus === "ok"
                        ?  
                        <div>
                            <Container style = {libraryNameStyle}><img src={libraryBackground} style={libraryNameBackgroundStyle}/>
                                <Row>
                                    <Col><h4>{this.state.libraries[0].name}</h4></Col>
                                </Row>
                                <Row>
                                    <Col><FontAwesomeIcon size="1x" icon={faPlusCircle}/> <input type="text" /></Col>
                                </Row>
                            </Container>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>ISBN</th>
                                        <th>Availability</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.libraries[0].books.map((book) =>

                                        <tr>
                                            <td>{book.title}</td>
                                            <td>{book.author}</td>
                                            <td>{book.ISBN}</td>
                                            <td>{book.available.toString()}</td>
                                        </tr>
                                        )
                                    }    
                                </tbody>
                            </Table>
                        </div>
                        :
                        <FontAwesomeIcon icon={faSpinner}/>
                }
            </Container>
        );
    }
}
var libraryNameStyle = {
    position: "relative",
    overflow: "hidden",
}
var libraryNameBackgroundStyle = {
    opacity: 0.5,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
};
var bilobaStyle = {
    position: "fixed",
    left: 0,
    top: "20%",
    width: "100%",
    height: "auto",
    opacity: 0.8,
    zIndex: -1,
    position: "top",
};
var searchStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    marginTop: "-50px",
    marginLeft: "-100px",
};