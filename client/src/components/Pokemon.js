import React, {Component, useEffect, useState} from 'react'
import axios from 'axios'

//const img = "https://pokeres.bastionbot.org/images/pokemon/"

class Pokemon extends Component {
    constructor(props) {
      super(props);
  
      this.state = { data: [], isEditToggled: false }
    }

    async componentDidMount() {
      try{
      const {data} = await axios.get('http://localhost:8080/pokemon')
      this.setState ( { data: data } )
      //console.log(data)
    } catch(error) {
      console.error(error.message);
    }
    }

    async deletePokemon(id) {
        try {
          const res = await axios.delete('http://localhost:8080/pokemon/' + id);
          //console.log(res.data);
          //alert("we'll meet again");
          const updateRes = await axios.get('http://localhost:8080/pokemon/');
            this.setState({ data: updateRes.data});
        } catch(e) {
          console.error(e, e.message);
        }
      }



      //const [selectedPokemon, setSelectedPokemon] = useState(null);


      
      // handleChange(e) {
      //   const { name, value } = e.target;
      //   this.setState( {...this.state,  [name]: value })
      // }

      async handleEditSubmit(e) {
        //alert("refresh page to see changes")
        //e.preventDefault();
        let edit = document.getElementById("myDIV");
        let name = document.getElementById("pokemonName");
        const nickname = document.getElementById("nickname").value;
        const editPokemon = {...this.state.data[0], nickname: nickname };
        try {
            const res = await axios.patch('http://localhost:8080/pokemon/', editPokemon);
            const updateRes = await axios.get('http://localhost:8080/pokemon/');
            this.setState({ data: updateRes.data});
            edit.style.display = "none";
            name.style.display = "block";
          } catch(e) {
            console.error(e, e.message);
          }
      }

    render() {

      return(
        <div id = "holder">
            <div className="pokemonCardContainer">  
              {
              this.state.data && this.state.data.map(data => (
                  <SinglePokemon data = {data} />
                  
              ))
              }
            </div>
        </div>
      )
    }
}

class SinglePokemon extends Component{
  constructor(props){
    super(props)

    this.state = {isEditToggled: false}
  }


  async toggleEdit() {
    // let edit = document.getElementById("myDIV");
    // let name = document.getElementById("pokemonName");
    // edit.style.display = "block";
    // name.style.display = "none";
    
    this.setState({isEditToggled: true})

  }


  render(){
    return(

      <div className="pokemonCard" key={this.props.data.id}>  
                      <div className="pokemonBackground" >
                          <form><div id="delete" onClick={ (e) => this.deletePokemon(this.data.id) }>❌</div></form>
                          <img id="pokemonImage" src= {this.props.data.imageUrl + ".png"} alt="" width="150px" />
                          <div id="pokemonNum">#{this.props.data.pokemonNum}</div>
                      </div> 

                      <div className="pokemonContent">
                          
                          <div id="pokemonNameContent">
                              <div id="edit" onClick={ (e) => this.toggleEdit() }>
                                ✏️
                              </div>
                              { this.state.isEditToggled && <div id="myDIV">
                                <form onSubmit={ (e) => this.handleEditSubmit(e) }>
                                  <input id="nickname" type="text" size="10" defaultValue={this.props.data.pokemonName}/>
                                  <input type="submit" value="update" />
                                </form>
                              </div>}
                             { !this.state.isEditToggled && <div id="pokemonName">
                                  {this.props.data.nickname ? this.props.data.nickname : this.props.data.pokemonName}
                              </div>}
                          </div>
                      </div>
                  </div>

    )
  }
}

export default Pokemon