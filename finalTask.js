window.addEventListener("load", function(){

    let equipmentsList = document.getElementById("equipmentsList");
    let check = document.getElementById("check");
    let select = document.getElementById("select");
    let checkTable = document.getElementById("checkTable");
    let resultTable = document.getElementById("resultTable");
    let submitBtn = document.getElementById("submitBtn");
    let toTopBtn = document.querySelector('#toTopBtn');
    let uncheckAll = document.getElementById("uncheckAll");
    let text = '';

    getData("equipments.json", equipmentsList, "список оборудовани€ дл€ проверки", draw_select);
        
    select.addEventListener("change", function() {
        if (this.selectedIndex === 0) return;
        //text = '';
        let val = this.value;
        text = this.options[this.selectedIndex].text;

        getData("checklists.json", check, "чек-лист", draw_table, val);
    })
    
    submitBtn.addEventListener("click", function() {
        calc(text);
      });
      uncheckAll.addEventListener("click", function(){
        let checkBoxes = document.querySelectorAll("input[type='checkbox']");
        checkBoxes.forEach(checkBox => checkBox.checked = false);
      })

    window.addEventListener("scroll", function(){
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            toTopBtn.style.display = "block";
          } else {
            toTopBtn.style.display = "none";
          }
        
        toTopBtn.addEventListener("click", function(){
            window.scrollTo(0,0);
        });
    });

    function draw_table(ob1, val){
        //провер€ем весь файл checklists
        for (let i = 0; i < ob1.length; i++){
            //если id оборудовани€ совпадает с выбранным в списке
            if (Number(ob1[i].equipment_id) === Number(val) ){

                //формирование шапки таблицы проверки
                createTableRow(checkTable, "th", null, "є", "id", "¬опрос", "¬ыполнено?");
                
                //удал€ем все строки, кроме шапки
                while (checkTable.childElementCount > 1) {
                    checkTable.removeChild(checkTable.lastChild);
                }

                //заполн€ем таблицу из json
                for (let j = 0; j < ob1[i].check_list.length; j++){
                    let tickBox = document.createElement("input");
                    tickBox.setAttribute("type", "checkbox");
                    createTableRow(checkTable, "td", null, String(j+1), ob1[i].check_list[j].id, ob1[i].check_list[j].requirement, tickBox);
                }                            
            }
        }
    }

    function calc(text){
        resultTable.style.visibility = "visible";          
            
        let checked = 0;
        let all = 0;

        for (let i = 1; i < checkTable.rows.length; i++){
            let data = checkTable.rows[i].cells[3].lastChild;
            all++;
            
            if (data.checked){
                checked++;
            }
        }

        let percent = (checked/all)*100;

        let d = new Date();
        let str_dd = ("0" + d.getDate()).slice(-2) + "." + ("0"+(d.getMonth()+1)).slice(-2) + "." + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
        
        let rowClass = "less_than_80";
        if (percent >= 80){
            rowClass = "more_than_80";
        }
        
        createTableRow(resultTable, "td", rowClass, str_dd, text, String(Math.round(percent)));
        resultTable.scrollIntoView();
    }

    function createTableRow(tbl, cell_type, rowClass, ...args){        
        let row = document.createElement("tr");
        for (let i = 0; i < arguments.length-3; i++){
            let cell = document.createElement(cell_type);
            //(typeof (args[i]) === "object") ? cell.append(args[i]) : cell.innerHTML = args[i];
            if (typeof (args[i]) === "object"){
                cell.append(args[i]);
                cell.style.textAlign = "center";
            }else{
                cell.innerHTML = args[i];
            }
            row.append(cell);
        }
        if (rowClass){
            row.className = rowClass;
        }
        tbl.append(row);
    }

    function draw_select(ob){
        //вывод выпадающего списка
        let s = "";
        //считывание файла equipments
        for (let i = 0; i < ob.length; i++){
            //добавление наименований оборудовани€ в список
            s += `<option value=${String(ob[i].id)}>${String(ob[i].name)}</option>`;
        }
        select.innerHTML += s;  
    }

    function getData(url, container, errorDescription, onSuccessHandler, args){
        fetch(url)
        .then((response) => {
            if (response.ok) {
              return response.json();
            } else {            
                throw new Error(`Ќе удалось загрузить ${errorDescription}: ${response.status} ${response.statusText}`);
            }
          })
          .then(data => onSuccessHandler(data, args))
          .catch((error) => {
            container.innerHTML = error;
            console.log(error);
          });
    }
})