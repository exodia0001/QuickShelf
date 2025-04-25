const params = new URLSearchParams(window.location.search);
const info = params.get("data");
//const urlParams = new URLSearchParams(window.location.search);
//const current_category = params.get('data');
document.getElementById("info").textContent = info;
let list_of_records =document.getElementById("records");
const back_btn=document.getElementById("back-btn");
const add_cat_btn=document.getElementById("add-cat");

let existing_records = JSON.parse(localStorage.getItem("Records")) || [];


add_cat_btn.addEventListener("click",function(){
    create_record(info);
})

function shorten_text(text){
    if (text.length>64){
        new_text=text.substring(0,63);
        new_text+="...";
        return new_text
    }
    else{
        return text
    }
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

            get_records_by_cat(category) //updating the UI need to be changed later
        } else {
            console.error("Tab or URL not available");
        }
    }
        else{
            console.log("Record already exist");
        }
    });
}






function get_records_by_cat(cat){
    list_of_records.innerHTML = "";
    category_records=[]
    let all_records = JSON.parse(localStorage.getItem("Records")) || [];
    if (all_records.length>0){
    for (let i=0;i<all_records.length;i++){
        if (all_records[i].category == cat ){
            //category_records.push(all_records[i])
            record=all_records[i];
            let li_record=document.createElement("li");
            let record_link=document.createElement("a");
            record_link.href=record.url;
            record_link.innerText=shorten_text(record.title);
            record_link.setAttribute("data-info",record.title)
            if ((record_link.getAttribute("data-info")).length>64){
            record_link.addEventListener("mouseover",function(){
                record_link.innerText=record_link.getAttribute("data-info");
            });
            record_link.addEventListener("mouseout",function(){
                record_link.innerText=shorten_text(record_link.getAttribute("data-info"));
            });
            }

            let delete_btn=document.createElement("button");
            delete_btn.innerText="X"
            delete_btn.setAttribute("record-id",i);
            delete_btn.addEventListener("click",function(){
                all_records.splice(i,1);
                localStorage.setItem("Records", JSON.stringify(all_records));
                this.parentElement.remove(); //this stills need to be tested

            })
            
            //the actual text of the record aka what you see 
            li_record.appendChild(record_link);
            li_record.appendChild(delete_btn);
            list_of_records.appendChild(li_record);
        }
    }
}
    //return category_records
}

get_records_by_cat(info)