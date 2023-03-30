let daySelectCount = 0;

fetch("https://syu-class.kro.kr/api/undergraduate/v1/15", { method: "get" })
  .then((response) => response.json())
  .then((data) => {
    const testData = JSON.stringify(data);
    const testDataParse = JSON.parse(testData);
    localStorage.setItem("api", JSON.stringify(data));
    // document.getElementById("time").innerHTML = testDataParse["time"];
    document.getElementById("count").innerHTML = testDataParse["api"].length + "개";
    setInfo(testDataParse, "전체");
  })
  .catch((error) => console.log(error));

function setInfo(datas, day) {
  document.getElementById("1").innerHTML = checkCount(datas, day, "기초교양") + "개";
  document.getElementById("2").innerHTML = checkCount(datas, day, "인성교양") + "개";
  document.getElementById("3").innerHTML = checkCount(datas, day, "일반선택영역") + "개";
  document.getElementById("4").innerHTML = checkCount(datas, day, "자연과학영역") + "개";
  document.getElementById("5").innerHTML = checkCount(datas, day, "사회과학영역") + "개";
  document.getElementById("6").innerHTML = checkCount(datas, day, "인문예술영역") + "개";
  document.getElementById("7").innerHTML = checkCount(datas, day, "디지털 리터러시영역") + "개";
  document.getElementById("8").innerHTML = checkCount(datas, day, "") + "개";

  document.getElementById("11").innerHTML = checkInfo(datas, day, "기초교양");
  document.getElementById("22").innerHTML = checkInfo(datas, day, "인성교양");
  document.getElementById("33").innerHTML = checkInfo(datas, day, "일반선택영역");
  document.getElementById("44").innerHTML = checkInfo(datas, day, "자연과학영역");
  document.getElementById("55").innerHTML = checkInfo(datas, day, "사회과학영역");
  document.getElementById("66").innerHTML = checkInfo(datas, day, "인문예술영역");
  document.getElementById("77").innerHTML = checkInfo(datas, day,"디지털 리터러시영역");
  document.getElementById("88").innerHTML = checkInfo(datas, day, "");

  document.getElementById("daySelectCount").innerHTML = daySelectCount + "개";
}
function daySelectEvent(object) {
  daySelectCount = 0;
  setInfo(JSON.parse(localStorage.getItem("api")), object.value);
}
function checkCount(datas, day, className) {
  let count = 0;
  for (let i = 0; i < datas["api"].length; i++) {
    if (datas["api"][i]["영역구분"] == className) {
      if (day == "전체") {
        count++;
        daySelectCount++;
      } else if (datas["api"][i]["수업시간/장소"].substr(0, 1) == day) {
        count++;
        daySelectCount++;
      }
    }
  }
  return count;
}
function changeDay(classInfo) {
  let day = 0;
  switch (classInfo) {
    case "월":
      day = 1;
      break;
    case "화":
      day = 2;
      break;
    case "수":
      day = 3;
      break;
    case "목":
      day = 4;
      break;
    case "금":
      day = 5;
      break;
    default:
      day = 0;
  }
  return day;
}
function checkInfo(datas, day, className) {
  let newData = [];
  let html_tag = "";
  for (let i = 0; i < datas["api"].length; i++) {
    if (datas["api"][i]["영역구분"] == className) {
      if (day == "전체") {
        newData.push(datas["api"][i]);
      } else if (datas["api"][i]["수업시간/장소"].substr(0, 1) == day) {
        newData.push(datas["api"][i]);
      }
    }
  }
  newData.sort((a, b) => {
    const dayA = a["수업시간/장소"].substr(0, 1);
    const dayB = b["수업시간/장소"].substr(0, 1);
    if (changeDay(dayA) > changeDay(dayB)) return 1;
    if (changeDay(dayA) < changeDay(dayB)) return -1;
    const timeA = parseInt(a["수업시간/장소"].substr(1, 2));
    const timeB = parseInt(b["수업시간/장소"].substr(1, 2));
    if (timeA > timeB) return 1;
    if (timeA < timeB) return -1;
  });
  // newData.sort((a, b) => {
  //   let aa = a["수업시간/장소"].substr(0, 1);
  //   let bb = b["수업시간/장소"].substr(0, 1);
  //   if (changeDay(aa) < changeDay(bb)) return 1;
  //   if (changeDay(aa) > changeDay(bb)) return -1;
  // });
  // console.log(newData);
  for (let i = 0; i < newData.length; i++) {
    html_tag += `
      <tr>
        <td nowrap><span style="color: yellow;">${newData[i]["과목코드"]}</span></td>
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
        <td class="text-end" nowrap><span style="color: #5f6062;">${newData[i]["장소"].replace(/강의실|\(小\)|\(中\)|\(大\)/g, "")}</span></td>
      </tr>
      `;
    // html_tag += `
    // <tr>
    //   <th scope="row"><span style="color: #5f6062;">${newData[i]["순번"]}</span></th>
    //   <td><span style="color: #5f6062;">${newData[i]["강좌번호"]}</span></td>
    //   <td><span style="color: yellow;">${newData[i]["과목코드"]}</span></td>
    //   <td><strong><span style="color: white;">${newData[i]["과목명"]}</span></strong></td>
    //   <td><span style="color: #5f6062;">${newData[i]["학부(과)"]}</span></td>
    //   <td><span style="color: #5f6062;">${newData[i]["학년"]}</span></td>
    //   <td><span style="color: white;">${newData[i]["이수구분"]}</span></td>
    //   <td><span style="color: white;">${newData[i]["영역구분"]}</span></td>
    //   <td><span style="color: yellow;">${newData[i]["학점"]}</span></td>
    //   <td><span style="color: #5f6062;">${newData[i]["교수명"]}</span></td>
    //   <td><span style="color: yellow;">${newData[i]["수업시간/장소"]}</span></td>
    // </tr>
    // `;
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
  // let table_tag = `
  // <table class="table table-dark">
  //   <thead>
  //     <tr>
  //       <th scope="col">순번</th>
  //       <th scope="col">강좌번호</th>
  //       <th scope="col">과목코드</th>
  //       <th scope="col">과목명</th>
  //       <th scope="col">학부(과)</th>
  //       <th scope="col">학년</th>
  //       <th scope="col">이수구분</th>
  //       <th scope="col">영역구분</th>
  //       <th scope="col">학점</th>
  //       <th scope="col">교수명</th>
  //       <th scope="col">수업시간/장소</th>
  //     </tr>
  //   </thead>
  //   <tbody>
  //     ${html_tag}
  //   </tbody>
  // </table>
  // `;
  return table_tag;
}