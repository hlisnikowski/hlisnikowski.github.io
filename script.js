
class Column{
    constructor(primary, auto, name, dataType, randomType) {
     this.primary = primary;
     this.auto = auto;
     this.name = name;
     this.dataType = dataType;
     this.randomType = randomType;
    }
}

function addColumn(){
    let div = document.getElementsByClassName("field")[0].cloneNode(true);
    document.getElementById("another-field").appendChild(div);
}

function removeColumn(){
    let fields = document.getElementById("another-field");
    let field = fields.lastElementChild;
    if(field){
        field.remove();
    }
}

const newLine = "\r\n";
const columnLine = ",\r\n";
const lastColumnLine = "\r\n";

function generate(){

    let table = document.getElementById("table-name").value;
    let fields = document.getElementsByClassName("field");

    let randomizer = document.getElementById("randomizer");
    let isRandom = randomizer.querySelector("[name='random']").checked;
    let insertCount = randomizer.querySelector("[name='insert-count'").value;

    let result= "create table " + table + " (\r\n";
    let inserts = "";
    
    let columns = [];

    Array.from(fields).forEach((col,index,array) => {
        var specials = col.children[0];
        var input = col.children[2];
        var select = col.children[3];
        var gen = col.children[4];

        var columnName = input.value;
        var datatype = select.options[select.selectedIndex].text;
        var gentype = gen.options[gen.selectedIndex].text;
        result += columnName+" "+datatype;
        console.log(specials);

        var isNullable = specials.querySelector("[name='nullable']").checked;
        if(!isNullable){
            result += " NOT NULL"
        }
        
        var isPrimary = specials.querySelector("[name='primary']").checked;
        if(isPrimary){
            result += " PRIMARY KEY"
        }

        var isAuto = specials.querySelector("[name='increment']").checked;
        if(isAuto){
            result += " AUTO_INCREMENT"
        }

        columns.push(new Column(isPrimary,isAuto,columnName,datatype,gentype));
        result += array.length - 1 == index ? lastColumnLine : columnLine;    
    });

    if(isRandom){
        inserts += createInsert(insertCount, table,columns);
    }
    result += ");" + newLine + inserts;
    document.getElementById("result-area").innerHTML = result;
}

function createInsert(insertCount,table,columns){
    let result = "" + newLine;
    result += "INSERT INTO " + table + newLine + "VALUES";
    for (let i = 0; i < insertCount; i++) {
     result += "("
       Array.from(columns).forEach((col,index,array)=>{
        if(col.dataType == 'BOOL' || col.dataType == 'INT'){
            result += getRandomValue(col,i);     
        } else {
            result += "'" + getRandomValue(col,i) + "'";
        }
        if(array.length -1 != index){
            result += ",";
        }
       });

       if(insertCount -1 == i){
        result +=");";
       } else
       result +=")," + newLine;
    }
    
    return result;
}

const lastNames = ["SMITH", "JOHNSON", "WILLIAMS", "JONES", "BROWN", "DAVIS", "MILLER", "MOORE", "ANDERSON", "JACKSON", "HARRIS", "THOMPSON", "MARTINEZ,", "CLARK", "LEWIS", "WALKER", "ALLEN", "HERNANDEZ", "WRIGHT", "HILL", "GREEN", "BAKER", "NELSON", "MITCHELL", "PEREZ", "ROBERTS", "TURNER", "PHILLIPS"];
const firstNames = ["JAMES", "JOHN", "ROBERT", "MICHAEL", "WILLIAM", "DAVID", "RICHARD", "CHARLES", "JOSEPH", "THOMAS", "CHRISTOPHER", "DANIEL", "PAUL", "MARK", "DONALD", "GEORGE", "KENNETH", "STEVEN", "EDWARD", "BRIAN", "RONALD"];
const numbers = ["0","1","2","3","4","5","6","7","8","9"];

function getRandomValue(column,index){
    if(column.auto){
        return index+1;
    }
    switch (column.randomType) {
        case "FIRSTNAME":
          return firstNames[Math.floor(Math.random() * firstNames.length)]
        case "LASTNAME":
            return lastNames[Math.floor(Math.random() * firstNames.length)]      
        case "FULLNAME":
            return firstNames[Math.floor(Math.random() * firstNames.length)] + " " + lastNames[Math.floor(Math.random() * firstNames.length)]     
        case "AGE":
            return Math.floor(1 + Math.random() * 80)
        case "PHONE":
            return getPhone();
        case "PIN":
            return getPin();
        case "COUNTRY":
            return getNationality();
        case "BOOL":
            return  Math.floor(Math.random() * 2) == 1 ? "true" : "false";
        default:
           return  ""
    }
}

function getPin(){
    result = "";
    for (let i = 0; i < 4; i++) {
        result +=  numbers[Math.floor(Math.random() * numbers.length)]  
    }
    return result;
}

function getNationality(){
    let arr = ["Czechia", "Hungary", "Germany", "Slovakia", "Italy", "Poland"];
    return arr[Math.floor(Math.random() * arr.length)]
}

function getPhone(){
    result = [];
    for (let i = 0; i < 3; i++) {
        let num = "";
        for (let i = 0; i < 3; i++) {
            num +=  numbers[Math.floor(Math.random() * numbers.length)]  
        }
        result.push(num);
    }
    return result.join('-');
}




