const existing_cat=document.getElementById("existing-cat");
const category_to_add=document.getElementById("category");
const add_btn=document.getElementById("add-btn");


let existing_records = JSON.parse(localStorage.getItem("Records")) || [];


function delete_category(cat,btnElement){
    for (i=0;i<existing_records.length;i++){
        let current_record=existing_records[i]
        if(current_record.category==cat){
            existing_records.splice(i, 1);
        }
    }
    let index=existing_categorys.indexOf(cat);
    existing_categorys.splice(index,1)
    localStorage.setItem("Records", JSON.stringify(existing_records));
    localStorage.setItem("Categories", JSON.stringify(existing_categorys));
    btnElement.closest("li").remove();
    //populate_existing_cat(existing_categorys);
        //Change this to just delete the element from the DOM instead of releoading the entire stuff for performance boost


}

function check_if_record_isunique(title,url,category){
    for (let i=0;i<existing_records.length;i++){
        let current_record=existing_records[i];
        if (current_record.url==url && current_record.title==title &&current_record.category==category){
            return false;  //return false if the record already exist
        }
    }
    return true;


}


function create_record(category) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length > 0 && tabs[0].url) {
            let url = tabs[0].url;
            let title = tabs[0].title;
            if (check_if_record_isunique(title,url,category)){
            let record = { url: url, category: category, title: title };
            existing_records.push(record);

            localStorage.setItem("Records", JSON.stringify(existing_records));
        } else {
            console.error("Tab or URL not available");
        }
    }
        else{
            console.log("Record already exist");
        }
    });
}



function populate_existing_cat(ex_cat){
    if (ex_cat != null){
    existing_cat.innerHTML=""
    for (let i = 0; i < ex_cat.length; i++) {
        let newli = document.createElement("li")
        let newspan=document.createElement("span")
        //newspan.classList.add("span-category")
        newspan.innerText=ex_cat[i]
        newspan.addEventListener("click",()=>{
            let category_to_pass=newspan.innerText;
            window.location.href = `category.html?data=${encodeURIComponent(category_to_pass)}`;
        })
        


        let save_url_btn=document.createElement("button")
        save_url_btn.innerText="+"
        save_url_btn.addEventListener("click", () => {
            create_record(ex_cat[i]);
        });

        let delete_category_btn=document.createElement("button");
        delete_category_btn.innerText="X";
        delete_category_btn.addEventListener("click",function(){
            delete_category(newspan.innerText,this);
        });
        
        let buttons_container=document.createElement("div");
        buttons_container.appendChild(save_url_btn);
        buttons_container.appendChild(delete_category_btn);
        newli.appendChild(newspan);
        newli.appendChild(buttons_container);
        newli.classList.add("category-list-element");
        existing_cat.appendChild(newli);
    }
}
}


let existing_categorys = JSON.parse(localStorage.getItem("Categories")) || [];

populate_existing_cat(existing_categorys)


function add_category(){
    let new_cat=category_to_add.value;
    category_to_add.value="";
    if (existing_categorys.includes(new_cat)){
        console.log("Value already exists")
    }
    else{
    existing_categorys.push(new_cat);
    localStorage.setItem("Categories", JSON.stringify(existing_categorys));
    let newli = document.createElement("li")
    let newspan=document.createElement("span")
    //newspan.classList.add("span-category")
    newspan.innerText=new_cat
    newspan.addEventListener("click",()=>{
        let category_to_pass=newspan.innerText;
        window.location.href = `category.html?data=${encodeURIComponent(category_to_pass)}`;
    })
    let save_url_btn=document.createElement("button")
    save_url_btn.innerText="+"
    save_url_btn.addEventListener("click", () => {
            create_record(ex_cat[i]);
        });

    let delete_category_btn=document.createElement("button");
    delete_category_btn.innerText="X";
    delete_category_btn.addEventListener("click",function(){
        delete_category(newspan.innerText,this);
    });
    //delete_category_btn.addEventListener("click",()=>delete_category(newspan.innerText));

    let buttons_container=document.createElement("div");
    buttons_container.appendChild(save_url_btn);
    buttons_container.appendChild(delete_category_btn);

    newli.appendChild(newspan);
    newli.appendChild(buttons_container);
    newli.classList.add("category-list-element");
    existing_cat.appendChild(newli);

    }
}
add_btn.onclick = add_category;




/* chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0 && tabs[0].url) {
        console.log(tabs[0].url);
    } else {
        console.error("Tab or URL not available");
    }
});
*/