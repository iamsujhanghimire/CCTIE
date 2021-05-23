$.ajax({
    url: 'data/members.csv',
    dataType: 'text'
}).done(processData);

function processData(raw) {
    const data = Papa.parse(raw.trim(), {header: true}).data;
    console.log(data);
    const memberListRoot = document.querySelector('#member_list');
    memberListRoot.innerHTML = '';

    for (const member of data) {
        console.log(member.name);
        const li = document.createElement('li');
        li.classList.add("list-group-item");
        memberListRoot.appendChild(li);

        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        li.appendChild(rowDiv);

        //Div for Pictures
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('col-lg-3');
        rowDiv.appendChild(imgDiv);

        //Div for Member Information
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('col-lg-9')
        infoDiv.classList.add('ebInfo');
        rowDiv.appendChild(infoDiv);

        //Member Picture
        const img = document.createElement('img');
        img.setAttribute('src', member.picture);
        imgDiv.appendChild(img);

        //Member Name
        const name = document.createElement('h1');
        name.innerText = member.first_name + " " + member.last_name;
        infoDiv.appendChild(name);

        //Member Club Title
        const major = document.createElement('h4');
        major.innerHTML = member.major;
        infoDiv.appendChild(major);

        //Member Major
        const address = document.createElement('h4');
        address.innerText = "Major: " + member.address;
        infoDiv.appendChild(address);

        //Member Area of Interest
        const interests = document.createElement('h4');
        interests.innerText = "Area of Interest: " + member.interests;
        infoDiv.appendChild(interests);

        //Member LinkedIn
        const icons = document.createElement('a');
        icons.innerHTML = `<i class="fab fa-linkedin" onclick="" style="width: 100px"></i>`
        infoDiv.appendChild(icons)

        const linkedin = document.createElement('h4');
        linkedin.innerHTML = `<a href=member.linkedin>LinkedIn</a>`
        infoDiv.appendChild(linkedin);

    }

    document.querySelectorAll('#member_list h1').forEach(ele => {
        ele.classList.add('name_text');
    });

    document.querySelector('#member_list').querySelectorAll('h4,p').forEach(ele => {
        ele.classList.add("main_text");
    });

    const allOverview = document.querySelectorAll('#member_list p');
    allOverview.forEach(function (p) {
        p.style.fontSize = '1.2rem';
    });

    document.querySelector('#member_list').querySelectorAll('h5,p').forEach(ele => {
        ele.classList.add("pru_noto");
        ele.classList.add("larger_text");
    });

}
// $('.ebInfo a').append(`<i class="fab fa-linkedin"></i>`)


$(document).ready(function (){
    $.getJSON('/get_current_user').done(function (data) {
        console.log(data)
        if(data['message'] === "success"){
            $('.login').remove();
            $('#showname').text(data.data.fullname);
        }else{
            $('.logout').remove()
        }
    })
})

