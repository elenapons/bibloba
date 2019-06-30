import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootswatch/dist/cosmo/bootstrap.css";
import "antd/dist/antd.less";
import bilobaImg from "./biloba.jpg";
import libraryBackground from "./defaultLibImg.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Layout,
    Tabs,
    Menu,
    Row,
    Col,
    Table,
    Modal,
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
    Redirect,
} from 'react-router-dom';
export {
    App
};
class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            sessionToken: null
        }
        this.storeSessionToken = this.storeSessionToken.bind(this)
        this.removeSessionToken = this.removeSessionToken.bind(this)
    }
    storeSessionToken(sessionToken){
        this.setState({
            sessionToken: sessionToken
        })
    }
    removeSessionToken(){
        this.setState({
            sessionToken: null
        })
    }
    render() {
        return (
            <Layout>
                <Layout.Header>
                    <h2 style={biblobaHeaderStyle}>BIBLOBA</h2>
                    <Menu theme="light" mode="horizontal" style={navBarStyle}>
                        <Menu.Item>
                            <NavLink to="/home">Home</NavLink>
                        </Menu.Item>
                        {
                            this.state.sessionToken !== null
                                ?
                                <Menu.Item>
                                    <NavLink to="/myLibraries">My Libraries</NavLink>
                                </Menu.Item>
                                : null
                        }
                        {
                            this.state.sessionToken !== null
                                ?
                                <Menu.Item>
                                    <NavLink to="/community">Community</NavLink>
                                </Menu.Item>
                                : null
                        }
                        <Menu.Item>
                            <NavLink to="/about">About</NavLink>
                        </Menu.Item>
                        {
                            this.state.sessionToken === null
                                ?
                                <LogInModal onLogedInReader={this.storeSessionToken}/>
                                :
                                <LogOutButton
                                    onLogedOutReader={this.removeSessionToken}
                                    sessionToken={this.state.sessionToken}
                                />
                        }
                    </Menu>
                </Layout.Header>
                <Layout.Content style={{ padding: '25px 50px' }}>
                    <Switch>
                        <Route path='/Home' component={Home} />
                        {
                            this.state.sessionToken !== null
                                ?
                                <Route path='/mylibraries' component={MyLibraries} />
                                : <Redirect to ='/Home' />
                        }    
                    </Switch>
                </Layout.Content>
            </Layout>
        );
    }
}
function Home() {
    return (
        <div>
            <img src={bilobaImg} style={bilobaStyle} alt="Ginko, Jean-Pierre Chéreau and Roger Culos" />
                <SearchMyBooks/>
        </div>
    );
}
class LogOutButton extends React.Component {
    constructor(props) {
        super(props);
        this.doLogOut = this.doLogOut.bind(this)
    }
    doLogOut() {
        fetch('http://localhost:3000/api/readers/logout?access_token='+this.props.sessionToken, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
        })
        .then(response => {
            if (response.ok) {
                this.props.onLogedOutReader()
            }
        })
    }
    render(){
        return (
            <Button type="primary"
                onClick={this.doLogOut} 
            >Log out</Button>
        )
    }
}
const LogInModal = Form.create()(
class extends React.Component {
    constructor(props) {
        super(props);
        this.showModal = this.showModal.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.state = {
            visibleModal: false,
            logInValidation: "idle"
        }
    }
    showModal() {
        this.setState({
            visibleModal: true,
        });
    }
    handleOk(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    logInValidation: "in progress"
                })
                fetch('http://localhost:3000/api/readers/login', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: values.username,
                        password: values.password
                    })
                })
                    .then(response => {
                        if (response.ok) {
                            response.json().then(data => this.props.onLogedInReader(data.id));
                            this.setState({
                                logInValidation: "success",
                                visibleModal: false,
                            })
                        }
                        else {
                            this.setState({
                                logInValidation: "error"
                            })
                        }
                    })
            }
        });
    }
    handleCancel(e) {
        console.log(e);
        this.setState({
            visibleModal: false,
        });
    }
    render() {
        const { getFieldDecorator, getFieldError } = this.props.form;
        return (
            <fragment>
            <Button type="primary" onClick={this.showModal}>Log in</Button>
            <Modal
                title="Log in"
                okText="Log in"
                visible={this.state.visibleModal}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading={
                    this.state.logInValidation === "in progress"
                }
                okButtonProps={{form:"logInForm", key:"submit", htmlType:"submit"}}
            >
                <Form id="logInForm" layout="inline" onSubmit={this.handleOk}>
                    <Form.Item
                    >
                        {getFieldDecorator('username', {
                            rules: [{ required: true }],
                        })(
                            <Input
                                prefix={
                                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                                }
                                placeholder="Username"
                            />)
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true }],
                        })(
                            <Input
                                prefix={
                                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                                }
                                type="password"
                                placeholder="Password"    
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        Can't log in? <a className="login-form-forgot" href="">Register now </a>
                        or <a href="">remember your password</a>!
                    </Form.Item>
                    <Form.Item>
                        {this.state.logInValidation === "error"
                            ? <span style={{ color: 'rgba(255,0,0,1)' }}><Icon type="warning"/> Login details are not valid</span>
                            : null
                        }
                    </Form.Item>
                </Form>
            </Modal>
            </fragment>
        );
    }
}
)
class MyLibraries extends React.Component {
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
    render() {
        const editLibraryLink = <Button icon="edit">Edit Library</Button>
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
            key: 'publishedDate',
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
        return <Row>
            {
                this.state.dataLoadingStatus === "ok"
                    ?
                    <Tabs size="large" tabBarGutter={4} tabBarExtraContent={editLibraryLink}>
                        {this.state.libraries.map((library) => {
                            return <Tabs.TabPane
                                key={library.id}
                                tab={
                                    <span>
                                        <h4>{library.name}</h4>
                                        {/* <img src={libraryBackground} style={libraryNameBackgroundStyle} /> */}
                                    </span>
                                }
                                style={libraryNameStyle}>
                                <Table columns={columns} dataSource={library.books} scroll={{ y: 360 }} />
                                <Row>
                                    <AddBookByISBN librarieid={library.id} onAddedBook={this.fetchLibraries} />
                                </Row>
                            </Tabs.TabPane>
                        })
                        }
                    </Tabs>
                    :
                    <FontAwesomeIcon icon={faSpinner} />
            }
        </Row>;
    }
}
class SearchMyBooks extends React.Component {
    constructor(props) {
        super(props);
        this.fetchMyBooks = this.fetchMyBooks.bind(this);
        this.state = {
            dataLoadingStatus: "pending",
        }
    }

    fetchMyBooks(e){
        e.preventDefault();
        const title = document.getElementById('SearchInput').value;
        fetch(`http://localhost:3000/api/books?filter={"where":{"title":{"like": "${title}", "options": "i"}}}`)
        .then(response => response.json())
        .then(jsonResponse => this.setState({
                dataLoadingStatus: "ok",
                myBooks: jsonResponse,
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
            title: 'Available',
            dataIndex: 'available',
            key: 'available',
            align: 'center',
            render: (available, book) => <ChangeAvailability
                bookId={book.id}
                onChangedAvailability={this.fetchLibraries}
                bookAvailability={available}
            />
        }]
        return(
            <div>
                <div className="searchbox col-md-4 col-sm-8 col-md-offset-1">
                    <form className="form-inline" onSubmit={this.fetchMyBooks} style={
                        this.state.dataLoadingStatus === "ok"
                        ? searchStyleResults
                        : searchStyleStart
                    }>
                        <input className="form-control" id="SearchInput" type="text" placeholder="Search..." />
                        <button className="btn btn-default" type="submit"><Icon type="search" /></button>
                    </form>
                </div>
                {
                    this.state.dataLoadingStatus === "ok"
                        ? <Table columns={columns} dataSource={this.state.myBooks} style={TableStyleResults} scroll={{ y: 300 }} />
                        : null   
                }
            </div>
        )
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
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ISBN: values.ISBN,
                        libraryId: this.props.librarieid
                    })
                })
                    .then(response => {
                        if (response.ok) {
                            this.props.onAddedBook()
                            this.setState({
                                addBookStatus: "success"
                            })
                            this.props.form.resetFields()
                        }
                        else {
                            this.setState({
                                addBookStatus: "error"
                            })
                        }
                        setTimeout(() => this.setState({
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
                                <Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />
                            }
                            placeholder="Add ISBN"
                            suffix={
                                <Tooltip title="The ISBN is often found in the back cover of your book :)">
                                    <Icon type="question-circle-o" style={{ color: 'rgba(0,0,0,.25)' }} />
                                </Tooltip>
                            } />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit">
                        Add Book
              </Button> <span style={{ margin: "5px" }}>{
                        this.state.addBookStatus === "in progress"
                            ? <Spin size="small" />
                            : this.state.addBookStatus === "success"
                                ? <Icon type="check" />
                                : this.state.addBookStatus === "error"
                                    ? <Icon type="warning" />
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
                if (response.ok) {
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
                    () => {
                        this.setState({
                            deleteBookStatus: "idle"
                        })
                        this.props.onDeletedBook()
                    },
                    1000
                )
            })
    }
    render() {
        return <span><Button
            style={{ marginRight: "3px" }}
            type="dashed"
            onClick={this.deleteBook}
            shape="circle"
        ><Icon type="delete" /></Button> {
                this.state.deleteBookStatus === "in progress"
                    ? <Spin size="small" />
                    : this.state.deleteBookStatus === "success"
                        ? <Icon type="check" />
                        : this.state.deleteBookStatus === "error"
                            ? <Icon type="warning" />
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                available: !this.props.bookAvailability
            })
        })
            .then(response => {
                if (response.ok) {
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
                    () => {
                        this.setState({
                            changeAvailabilityStatus: "idle"
                        })
                    },
                    3000
                )
            })
    }
    render() {
        return <AntSwitch
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="cross" />}
            checked={this.props.bookAvailability}
            onChange={this.changeAvailability} />

    }
}
const AddBookByISBN = Form.create()(_AddBookByISBN);
var navBarStyle = {
    float: "right",
    lineHeight: '64px',
}

var biblobaHeaderStyle = {
    float: "left",
    lineHeight: "64px"
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
    maxHeight: "100%",
    minWidth: "100%",
    objectFit: "cover"
};
var bilobaStyle = {
    left: -43,
    top: "13%",
    width: "100%",
    height: "auto",
    opacity: 0.8,
    zIndex: -1,
    position: "absolute",
};
var searchStyleStart = {
    position: "fixed",
    top: "50%",
    left: "50%",
    marginTop: "-50px",
    marginLeft: "-100px",
};
var searchStyleResults ={
    position: "fixed",
    top: "30%",
    left: "50%",
    marginTop: "-50px",
    marginLeft: "-100px",
};
var TableStyleResults ={
    position: "fixed",
    top: "50%",
    left: "25%",
    right: "25%",
    marginTop: "-50px",
    
}



















