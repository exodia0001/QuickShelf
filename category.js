const params = new URLSearchParams(window.location.search);
const info = params.get("data");
document.getElementById("info").textContent = info;
let list_of_records =document.getElementById("records");
const back_btn=document.getElementById("back-btn");
const add_cat_btn=document.getElementById("add-cat");
const search_bar=document.getElementById("search-bar");

let existing_records = JSON.parse(localStorage.getItem("Records")) || [];


function filter_by_substring(substring,list){
    let records_contain_substr=[]
    if (list.length>0){
        for (let i=0;i<list.length;i++){
            let current_record=list[i]
            let record_title=(current_record.title).toLowerCase()
            if (record_title.includes(substring.toLowerCase())){
                records_contain_substr.push(current_record)
            }
        }
        return records_contain_substr
    }
}


search_bar.addEventListener("keypress",function(event){
    if (event.key=="Enter"){
        let cat_records=get_list_records_by_cat();
        text_to_search=search_bar.value;
        filtered_records=filter_by_substring(text_to_search,cat_records);
        get_records_by_cat(filtered_records);
    }
})



add_cat_btn.addEventListener("click",function(){
    create_record(info);
})



function get_list_records_by_cat(){
    let category_records=[]
    if (existing_records.length>0){
        for (let i=0;i<existing_records.length;i++){
            if (existing_records[i].category == info ){
                category_records.push(existing_records[i])
            }
        }
        return category_records

    }
    return category_records
}



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
            let title = tabs[0].title || "Untitled Page";
            if (check_if_record_isunique(title,url,category)){
            let record = { url: url, category: category, title: title };
            existing_records.push(record);

            localStorage.setItem("Records", JSON.stringify(existing_records));

            let cat_rec=get_list_records_by_cat()
            get_records_by_cat(cat_rec) //updating the UI need to be changed later for performance
        } else {
            console.error("Tab or URL not available");
        }
    }
        else{
            console.log("Record already exist");
        }
    });
}






function get_records_by_cat(records){
    list_of_records.innerHTML = "";
    //category_records=[]
    if (records.length>0){
    for (let i=0;i<records.length;i++){
            //category_records.push(all_records[i])
            let record=records[i];
            let li_record=document.createElement("li");
            let record_link=document.createElement("a");
            record_link.href=record.url;
            record_link.innerText=shorten_text(record.title);

            record_link.addEventListener("click",function(e){
                e.preventDefault();
                chrome.tabs.create({url:record.url,active:false});
            })
            
            record_link.setAttribute("data-info",record.title);
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
                let index=existing_records.indexOf(record)
                existing_records.splice(index,1);
                localStorage.setItem("Records", JSON.stringify(existing_records));
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
let cat_rec=get_list_records_by_cat();
get_records_by_cat(cat_rec);
