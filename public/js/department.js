async function getRequest(urlParams) {
  const getResponse = await fetch("https://syu-class.kro.kr/api/" + urlParams, { method: "get" });
  const getJson = await getResponse.json();
  return getJson;
}

function setYears() {
  let tags = "";
  tags += "<select class=\"form-select form-select-sm\" name=\"\" onchange=\"onYearEvent(this)\">";
  tags += "<option value=\"0\" selected>-개설년도-</option>";
  for (let i = 2000; i <= 2023; i++) {
    tags += "<option value=\"" + i + "\">-" + i + "-</option>";
  }
  tags += "</select>";
  document.getElementById("year").innerHTML = tags;
}

function setSemesters() {
  let tags = "";
  tags += "<select class=\"form-select form-select-sm\" name=\"\" onchange=\"onSemesterEvent(this)\">";
  tags += "<option value=\"0\" selected>-개설학기-</option>";
  tags += "<option value=\"1\">-1학기 정규-</option>";
  tags += "<option value=\"2\">-2학기 정규-</option>";
  tags += "</select>";
  document.getElementById("semester").innerHTML = tags;
}

function setDepartments() {
  getRequest("college/v1/all").then((data) => {
    let datas = data["api"];
    let tags = "";
    tags += "<select class=\"form-select form-select-sm\" name=\"\" onchange=\"onDepartmentEvent(this)\">";
    tags += "<option value=\"0\" selected>-학부(과)-</option>";
    for (let i = 0; i < datas.length; i++) {
      tags += "<option value=\"" + (i + 1) +"\">-" + datas[i]["학부(과)"] + "-</option>";
    }
    tags += "</select>";
    document.getElementById("department").innerHTML = tags;
  });
}

function setInfo(datas) {
  let newData = datas["api"];
  let html_tag = "";
  for (let i = 0; i < newData.length; i++) {
    html_tag += `
      <tr>
        <td nowrap><span style="color: #5f6062;">${newData[i]["과목코드"]}</span></td>
        <td nowrap><strong><span style="color: white;">${newData[i]["과목명"]}</span></strong></td>
        <td nowrap><span style="color: #5f6062;">${newData[i]["학년"]}</span></td>
        <td nowrap><span style="color: yellow;">${newData[i]["학점"]}</span></td>
        <td nowrap><span style="color: #5f6062;">${newData[i]["이수구분"]}</span></td>
        <td nowrap><span style="color: #5f6062;">
          <a href="https://everytime.kr/lecture/search?keyword=${newData[i]["교수명"]}&condition=professor" target="_blank">
            ${newData[i]["교수명"]}
          </a>
        </span></td>
        <td nowrap><span style="color: yellow;">${newData[i]["수업시간"]}</span></td>
        <td class="text-end" nowrap>
          <span style="color: #5f6062;">
            ${newData[i]["장소"].replace(/강의실|\(小\)|\(中\)|\(大\)/g, "")}
          </span>
        </td>
      </tr>
    `;
  }
  let table_tag = `
    <div class="table-responsive">
      <table class="table table-dark">
        <thead>
          <tr>
            <th scope="col" nowrap>과목코드</th>
            <th scope="col" nowrap>과목명</th>
            <th scope="col" nowrap>학년</th>
            <th scope="col" nowrap>학점</th>
            <th scope="col" nowrap>이수구분</th>
            <th scope="col" nowrap>교수명</th>
            <th scope="col" nowrap>수업시간
            <th class="text-end" scope="col" nowrap>장소</th>
          </tr>
        </thead>
        <tbody>
          ${html_tag}
        </tbody>
      </table>
    </div>
  `;
  return table_tag;
}

let year = 0;
let semester = 0;
let department = 0;

function onYearEvent(object) {
  year = object.value;
  document.getElementById("info-year").innerHTML = year;
  if (year != 0 && semester != 0 && department != 0){
    getRequest("undergraduate/v1/" + year + "/" + semester + "/" + department).then((data) => {
      document.getElementById("info-count").innerHTML = data["api"].length + "개";
      document.getElementById("department-info").innerHTML = setInfo(data);
    });
  }
}

function onSemesterEvent(object) {
  semester = object.value;
  document.getElementById("info-semester").innerHTML = semester;
  if (year != 0 && semester != 0 && department != 0){
    getRequest("undergraduate/v1/" + year + "/" + semester + "/" + department).then((data) => {
      document.getElementById("info-count").innerHTML = data["api"].length + "개";
      document.getElementById("department-info").innerHTML = setInfo(data);
    });
  }
}

function onDepartmentEvent(object) {
  department = object.value;
  document.getElementById("info-department").innerHTML = object.options[object.selectedIndex].text.replaceAll("-", "");
  if (year != 0 && semester != 0 && department != 0){
    getRequest("undergraduate/v1/" + year + "/" + semester + "/" + department).then((data) => {
      document.getElementById("info-count").innerHTML = data["api"].length + "개";
      document.getElementById("department-info").innerHTML = setInfo(data);
    });
  }
}

setYears();
setSemesters();
setDepartments();
