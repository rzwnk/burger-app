import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const API_URL = "http://demo4261378.mockable.io/";
const MAX_DISCOUNT = 50;

class App extends React.Component {
  state = {
    data: [],
    headers: ['Name', 'ingredients', 'discount', 'price', 'Selected items ', 'action'],
    cart: [],
    searchString: ''
  }

  async componentDidMount () {
    const p = await fetch('http://demo4261378.mockable.io/');
    const data = await p.json();
    this.setState({data:data.data});
  }
  addToCart = (item) => {
    let cart  = [...this.state.cart];
    if(cart.length){
      let found = false;
      for(let i=0; i<cart.length; i++) {
        if(cart[i].item===item){
          cart[i].count += 1 ;
          found = true;
        }
      }
      if(!found){
        cart = [...cart, {item, count: 1}]
      }

    }
    else cart = [{item, count:1}];

    this.setState({cart})
  }
  getPrice(){
    const {cart} = this.state;
    if(cart.length){
      let p = 0;
      for(let i=0;i<cart.length; i++){
        const price = cart[i].item.price;
        const discount = cart[i].item.discount;
        const count = cart[i].count;
        p += (price*count) - Math.min(MAX_DISCOUNT, (discount*count));
      }
      return p;

    }
    else return 0
  }

  render(){
    const {data, headers, cart, searchString} = this.state
    return (
      <div className="App">
        <h1>Burger App</h1>

      <div className="row" ><input onChange={({ target: {value} })=>this.setState({searchString: value})  } value={searchString} placeholder="search here" type="text"/></div>
        <div className="row header">
          {headers.map(i=>{
            return <div className="cell" >{i}</div>
          })}
        </div>
        {
            data.map(item=>{
              const {name, price, ingredients, discount} = item;
              const str = searchString.toLowerCase();
              if(name.toLowerCase().indexOf(str)===-1 && ingredients.indexOf(str)===-1)return null;
              return <div className="row">
                <div className="cell">{name}</div>
                <div className="cell" >{ingredients.join(', ')}</div>
                <div className="cell" >{discount}</div>
                <div className="cell" >{price}</div>
                <div className="cell" >{containsObject(item, cart).count || 0}</div>
                <div className="cell" ><button  onClick={()=>this.addToCart(item)}>Add To Cart</button></div>
              </div>
            })
          }


          <h1>Order summary</h1>

          <div className='row'>
            Price After discount : <div>{this.getPrice()} Rupees</div>
          </div>


          <input className="checkoutButton" onClick={()=>{alert("your will be delivered in x minutes")}} type="button" value="Checkout"/>
      </div>
    )
  }

}

export default App;

function containsObject(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
      if (list[i].item === obj) {
          return list[i];
      }
  }

  return false;
}