import React from 'react';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();
class App extends React.Component {
  constructor(){
    super();
    this.state = {
      name:'',
      salary:'',
      _id:'0',
      employees:[]
    };
    this.handleChange = this.handleChange.bind(this);
    this.addEmployee = this.addEmployee.bind(this);
  }
  //definicion de los metodos para el proyecto de
  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]:value
    });
  }
  handleSubmit(event){
    alert('El nombre es:' + this.state.name + 'salario: '+this.state.salary);
    event.preventDefault();
  }

  addEmployee(e) {
    e.preventDefault();
    if (this.state._id) {
      fetch(`http://localhost:3000/${this.state._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: this.state.name,
          salary: this.state.salary
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          this.setState({ _id: '0', name: '', salary: '' });
          toast.success("Updated/Added", {
            position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000
          });
          this.refreshEmployee();
        });
    }
    else {
      fetch('http://localhost:3000', {
        method: 'POST',
        body: JSON.stringify(this.state),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          this.setState({
            name:'',
            salary:''
          })
          toast.success("Add/Updated", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 1000
          });
          this.refreshEmployee();
        })
        .catch(err => console.error(err));

    }
  }
  deleteEmployee(id){
    if (window.confirm('Esta seguro de eliminar este empleado')){
      fetch(`http://localhost:3000/${id}`,{
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data =>{
        toast.success("Deleted",{
          position:toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000
        });
        this.refreshEmployee()
      });
    }
  }

  editEmployee(id){
    fetch(`http://localhost:3000/${id}`)
    .then(res => res.json())
    .then(data =>{
      this.setState({
        name:data.name,
        salary:data.salary,
        _id:data.id
      });
    });
  }

  refreshEmployee(){
    const apiUrl = 'http://localhost:3000';
    fetch(apiUrl)
    .then((response) =>response.json())
    .then((data) =>{
      this.setState({employees: data});
    })
  }

  componentDidMount() {
    this.refreshEmployee();
  }
  render(){
    return(
      <div className="container">
        {/* Formulario */}
        <form onSubmit={this.addEmployee}>
          <div className="mb-3">
            <label for="name" className="form-label">Name</label>
            <input type="text" name="name" className="form-control" onChange={this.handleChange} value={this.state.name} placeholder="Name" autoFocus/>
          </div>
          <div className="mb-3">
            <label for="salary" className="form-label">Salary</label>
            <input type="number" name="salary" className="form-control"  onChange={this.handleChange}  value={this.state.salary} placeholder="Salary"/>
          </div>
          <button type="submit" className="btn btn-primary">Save</button>
        </form>
        {/* Fin Formulario */}
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.employees.map(employee => {
                return (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.salary}</td>
                    <td>
                          <button onClick={() => this.editEmployee(employee.id)} className="btn btn-primary" style={{margin: '4px'}}>
                             <i className="far fa-edit"></i></button>
                            <button onClick={() => this.deleteEmployee(employee.id)} className="btn btn-danger">
                            
                            </button>
                            
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}
export default App;
