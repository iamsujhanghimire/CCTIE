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
        infoDiv.classList.add('col-lg-9');
        rowDiv.appendChild(infoDiv);

        //Member Picture
        const img = document.createElement('img');
        img.setAttribute('src', member.picture);
        imgDiv.appendChild(img);

        //Member Name
        const name = document.createElement('h1');
        name.innerText = member.first_name + " " + member.last_name;
        infoDiv.appendChild(name);

        //Member Department
        const major = document.createElement('h5');
        major.innerHTML = member.major;
        infoDiv.appendChild(major);

        //Member Email
        const email = document.createElement('p');
        email.innerText = member.email;
        infoDiv.appendChild(email);

        //Member Address
        const address = document.createElement('p');
        address.innerText = member.address;
        infoDiv.appendChild(address);

        //Member's Pet Preference
        const img2 = document.createElement('img');
        img2.setAttribute('src', getPet(member.pet));
        //setting the class for pet's image for css styling
        img2.setAttribute('class', 'pet_img');
        infoDiv.appendChild(img2);
    }

    document.querySelectorAll('#member_list h1').forEach(ele => {
        ele.classList.add('name_text');
    });

    document.querySelector('#member_list').querySelectorAll('h5,p').forEach(ele => {
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

    const memberList = document.querySelector('#member_list').children;
    console.log(memberList);
    for (let i = 0; i < memberList.length; i++) {
        memberList[i].addEventListener('click', function () {
            console.log(memberList[i]);
            memberList[i].classList.toggle('italic_text');
        });
    }
}

function getPet(pet) {
    if (pet === "dog") return "img/dog.svg";
    else if (pet === "cat") return "img/cat.svg";
    else if (pet === "both") return "img/both.svg";
    else return "img/none.svg";
}

let selectedPrefs = {};

function showList(val) {
    let petPreference = '';
    selectedPrefs[val.value] = val.checked;
    let memberList = document.getElementById('member_list');
    const child = memberList.childNodes;

    for (let i = 0; i < child.length; i++) {
        petPreference = child[i].lastChild.lastChild.lastChild;
        let source = petPreference.getAttribute("src");
        //When nothing is selected, remove gold bg
        if (source.includes(val.value) && !val.checked) {
            child[i].classList.remove("gold_bg");
        }
        //Change gold bg according to highlight selection
        for (let pref in selectedPrefs) {
            if (source.includes(pref) && selectedPrefs[pref]) {
                child[i].classList.add("gold_bg");
                break;
            }
        }
    }
}




