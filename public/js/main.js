let jsondata = {};
let daySelectCount = 0;

async function getRequest() {
  const getResponse = await fetch("https://syu-class.kro.kr/api/undergraduate/v1/2023/1/15", { method: "get" });
  const getJson = await getResponse.json();
  return getJson;
}

getRequest().then((data) => {
    setBasePage(data, "전체");
    jsondata = data;
  });

function daySelectEvent(object) {
  daySelectCount = 0;
  setBasePage(jsondata, object.value);
}

function setBasePage(datas, day) {
  let classArea = [
    "기초교양",
    "인성교양",
    "일반선택영역",
    "자연과학영역",
    "사회과학영역",
    "인문예술영역",
    "디지털 리터러시영역",
    "" // 교직영역
  ];
  for (let i = 0; i < classArea.length; i++) {
    const sectionCount = String(i + 1); // 1, 2, 3, 4, 5, 6, 7, 8
    const sectionInfo = String(i + 1) + String(i + 1); // 11, 22, 33, 44, 55, 66, 77, 88
    document.getElementById(sectionCount).innerHTML = getSectionCount(datas, day, classArea[i]) + "개";
    document.getElementById(sectionInfo).innerHTML = getSectionInfo(datas, day, classArea[i]);
  }
  document.getElementById("count").innerHTML = daySelectCount + "개";
}

function getSectionCount(datas, day, className) {
  let count = 0;
  for (let i = 0; i < datas["api"].length; i++) {
    if (datas["api"][i]["영역구분"] === className) {
      if (day === "전체") {
        count++;
        daySelectCount++;
      } else if (datas["api"][i]["수업시간"].substr(0, 1) === day) {
        count++;
        daySelectCount++;
      } else if (datas["api"][i]["수업시간"].split(",")[1] !== undefined) {
        if (datas["api"][i]["수업시간"].split(",")[1].substr(0, 1) === day) {
          count++;
          daySelectCount++;
        }
      }
    }
  }
  return count;
}

function convertDay(day) {
  let dayNum = 0;
  if (day === "월") dayNum = 1
  else if (day === "화") dayNum = 2
  else if (day === "수") dayNum = 3
  else if (day === "목") dayNum = 4
  else if (day === "금") dayNum = 5
  else dayNum = 0
  return dayNum;
}

function starTest() {
  let stars = "";
  for (let i = 0; i < 5; i++) {
    // stars += "<i class=\"bi bi-star\"></i>"
    stars += "<i class=\"bi bi-star-fill\" style=\"color: yellow;\"></i>"
  }
  return stars;
}

function getSectionInfo(datas, day, className) {
  let newData = [];
  let html_tag = "";
  for (let i = 0; i < datas["api"].length; i++) {
    if (datas["api"][i]["영역구분"] === className) {
      if (day === "전체") {
        newData.push(datas["api"][i]);
      } else if (datas["api"][i]["수업시간"].substr(0, 1) === day) {
        newData.push(datas["api"][i]);
      } else if (datas["api"][i]["수업시간"].split(",")[1] !== undefined) {
        if (datas["api"][i]["수업시간"].split(",")[1].substr(0, 1) === day) {
          newData.push(datas["api"][i]);
        }
      }
    }
  }
  newData.sort((a, b) => {
    const dayA = a["수업시간"].substr(0, 1);
    const dayB = b["수업시간"].substr(0, 1);
    if (convertDay(dayA) > convertDay(dayB)) return 1;
    if (convertDay(dayA) < convertDay(dayB)) return -1;
    const timeA = parseInt(a["수업시간"].substr(1, 2));
    const timeB = parseInt(b["수업시간"].substr(1, 2));
    if (timeA > timeB) return 1;
    if (timeA < timeB) return -1;
  });
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
        <td class="text-center" nowrap>
          <span style="color: #5f6062;">
            ${starTest()}
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
            <th class="text-center" scope="col" nowrap>별점</th>
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