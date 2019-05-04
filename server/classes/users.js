class Users {
  constructor(){
    this.persons = [];  //personas conectadas al chat
  }
 // Aggregar una persona al chat
  addPersons(id, name, room){
    // Crear una persona
    let person = { id, name, room };

    // agregar a la persona al array de personas
    this.persons.push(person);

    return this.persons;  //retornar a todas las personas
  }

  // Para obtener una persona en especifico por su id
  getPerson(id){
  //  let person = this.persons.filter((person) => {
    //  return person.id === id;  //la funcion filter retorna un nuevo array
  //  })[0]; //0 para que siempre sea un inico registro
  let person = this.persons.filter((person) => person.id === id)[0];

  // Si no encoentra una persona por el id, retornara undefined
  return person;
  }

  // Para obtener a todas las personas
  getPersons(){
    return this.persons;
  }

  getPersonsForRoom(room){
    // ....
  }

  // Para eliminar a alguien del array de personas
   deletePerson(id){
     let personDelete = this.getPerson(id);

     this.persons = this.persons.filter((person) => person.id != id);
     // EN esta asignacion se sustituye el viejo array personas por uno nuevo excluyendo a la persona que se
     // quiera elminar del mismo
     return personDelete; //Para indicar cual fue la persona que se borro
   }
}

module.exports = {
  Users
}

// Asi es el objeto que se va a tener por cada usuario
// {
//   id: '0sadasdjhga'
//   name: ' Cesar',
//   sala: 'Video juegos'
// }
// = es una asignacion, === es una comparacion
