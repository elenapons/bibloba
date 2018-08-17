import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootswatch/dist/cosmo/bootstrap.css";
import "antd/dist/antd.css";
import bilobaImg from "./biloba.jpg";
import libraryBackground from "./zigzag.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Layout,
    Menu,
    Row,
    Col,
    Table,
    Form,
    Icon,
    Input,
    Button,
    Tooltip,
    Spin,
    Switch as AntSwitch,
  } from 'antd';
import { faSearch, faSpinner, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import {
    Switch,
    Route,
    NavLink,
  } from 'react-router-dom';
export {
    App
};
function App() {
    return (
        <Layout>
            <Layout.Header>
                <span style={biblobaHeaderStyle}>BIBLOBA</span>
                <Menu theme="dark" mode="horizontal" style={navBarStyle}>
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
            <Layout.Content style={{ padding: '25px 50px' }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                    
                    <Switch>
                        <Route exact path='/Home' component={Home}/>
                        <Route path='/mylibrary' component={MyLibrary}/>
                    </Switch>
                </div>
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
        this.fetchLibraries = this.fetchLibraries.bind(this)
    }
    componentDidMount() {
        this.fetchLibraries();
    }
    fetchLibraries() {
        fetch('http://localhost:3000/api/readers/5b7033906aab112a9ed07285/libraries?filter[include]=books')
            .then(response => response.json())
            .then(jsonResponse => this.setState({
                dataLoadingStatus: "ok",
                libraries: jsonResponse,
            }))
    }
    render(){
        const columns = [{
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
          }, {
            title: 'Author/s',
            dataIndex: 'authors',
            key: 'authors',
          }, {
            title: 'ISBN',
            dataIndex: 'ISBN',
            key: 'ISBN',
          }, {
            title: 'Year',
            dataIndex: 'publishedDate',
            key: 'publishedDate'
          }, {
            title: 'Available',
            dataIndex: 'available',
            key: 'available',
            align: 'center',
            render: (available, book) => <ChangeAvailability
                bookId={book.id}
                onChangedAvailability={this.fetchLibraries}
                bookAvailability={available}
                />
                 
          }, {
            title: 'Action',
            align: 'right',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (id) => 
                <DeleteBook onDeletedBook={this.fetchLibraries} bookId={id} />

          }];
        return (
            <Row>
                {
                    this.state.dataLoadingStatus === "ok"
                        ?  
                        <div>
                            <Row style={libraryNameStyle}><img src={libraryBackground} style={libraryNameBackgroundStyle}/>
                                <Row>
                                    <Col><h4>{this.state.libraries[0].name}</h4></Col>
                                </Row>
                            </Row>
                            <Table columns={columns} dataSource={this.state.libraries[0].books}/>   
                            <Row>
                                <AddBookByISBN librarieid={this.state.libraries[0].id} onAddedBook={this.fetchLibraries}/> 
                            </Row> 
                        </div>
                        :
                        <FontAwesomeIcon icon={faSpinner}/>
                }
            </Row>
        );
    }
}
class _AddBookByISBN extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            addBookStatus: "idle"
        }
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    addBookStatus: "in progress"
                })
                fetch('http://localhost:3000/api/books/byISBN', {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        ISBN: values.ISBN,
                        libraryId: this.props.librarieid
                    }) 
                })
                .then(response => {
                    if (response.ok){
                        this.props.onAddedBook()
                        this.setState({
                            addBookStatus: "success"
                        })
                    }
                    else {
                        this.setState({
                            addBookStatus: "error"
                        })
                    }
                setTimeout(()=> this.setState({
                    addBookStatus: "idle"
                    }),
                    3000)
                })
            }
        }); 
    }
    render() {
        const { getFieldDecorator, getFieldError } = this.props.form;
    
        // Only show error after a field is touched.
        const ISBNError = getFieldError('ISBN');
        return (
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Form.Item
                validateStatus={"success"}
                help={''}
            >
              {getFieldDecorator('ISBN', {
                rules: [{ required: true }],
              })(
                <Input
                    prefix={
                        <Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }}/>
                    }
                    placeholder="Add ISBN"
                    suffix={
                    <Tooltip title="The ISBN is often found in the back cover of your book :)">
                        <Icon type="question-circle-o" style={{ color: 'rgba(0,0,0,.25)' }}/>
                    </Tooltip>
                }/>
              )}
            </Form.Item>
            <Form.Item>
                <Button
                type="primary"
                htmlType="submit">
                Add Book 
              </Button> <span style={{ margin: "5px"}}>{
                this.state.addBookStatus === "in progress"
                    ? <Spin size="small"/>
                    :this.state.addBookStatus === "success"
                        ? <Icon type="check"/>
                        : this.state.addBookStatus === "error"
                            ? <Icon type="warning"/>
                            : ''
            }</span>
            </Form.Item>
          </Form>
        );
      }
}
class DeleteBook extends React.Component {
    constructor(props) {
        super(props);
        this.deleteBook = this.deleteBook.bind(this);
        this.state = {
            deleteBookStatus: "idle"
        }
    }
    deleteBook() {
        fetch('http://localhost:3000/api/books/' + this.props.bookId, {
            method: "DELETE",
        })
        .then(response => {
            if (response.ok){
                this.setState({
                    deleteBookStatus: "success"
                })
            }
            else {
                this.setState({
                    deleteBookStatus: "error"
                })
            }
            setTimeout(
                ()=> {
                    this.setState({
                    deleteBookStatus: "idle"
                    })
                    this.props.onDeletedBook()
                },
                1000
            )
        })   
    }
    render (){
        return <span><Button
        style={{marginRight: "3px"}} 
        type="dashed"
        onClick={this.deleteBook}
        shape="circle"
        ><Icon type="delete" /></Button> {
            this.state.deleteBookStatus === "in progress"
                ? <Spin size="small"/>
                :this.state.deleteBookStatus === "success"
                    ? <Icon type="check"/>
                    : this.state.deleteBookStatus === "error"
                        ? <Icon type="warning"/>
                        : ''
        }</span>
    }
}
class ChangeAvailability extends React.Component {
    constructor(props) {
        super(props);
        this.changeAvailability = this.changeAvailability.bind(this);
        this.state = {
            changeAvailabilityStatus: "idle"
        }
    }
    changeAvailability() {
        fetch('http://localhost:3000/api/books/' + this.props.bookId, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                available: !this.props.bookAvailability
            }) 
        })
        .then(response => {
            if (response.ok){
                this.setState({
                    changeAvailabilityStatus: "success"
                })
                this.props.onChangedAvailability()
            }
            else {
                this.setState({
                    changeAvailabilityStatus: "error"
                })
            }
            setTimeout(
                ()=> {
                    this.setState({
                        changeAvailabilityStatus: "idle"
                    })
                },
                3000
            )
        })   
    }
    render (){
        return <AntSwitch
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="cross" />}
            checked={this.props.bookAvailability} 
            onChange={this.changeAvailability}/>

    }
}
const AddBookByISBN = Form.create()(_AddBookByISBN);
var navBarStyle = {
    float:"right",
    lineHeight: '64px',
}

var biblobaHeaderStyle = {
    float:"left",
    color: "white",
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
    zIndex: 0,
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



















