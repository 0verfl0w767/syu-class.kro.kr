fetch("https://syu-class.kro.kr/api/college/v1/all", { method: "get" })
  .then((response) => response.json())
  .then((data) => {
    const testData = JSON.stringify(data);
    const testDataParse = JSON.parse(testData);
    setInfo(testDataParse);
  })
  .catch((error) => console.log(error));

function setInfo(data) {
  document.getElementById("show").innerHTML = checkInfo(data);
}

function checkInfo(data) {
  let datas = data["api"];
  let html_tag = "";
  for (let i = 0; i < datas.length; i++) {
    html_tag += `
      <tr>
        <td><span style="color: white;">${datas[i]["단과대학"]}</span></td>
        <td><strong><span style="color: white;">${datas[i]["학부(과)"]}</span></strong></td>
        <td><span style="color: yellow;">${datas[i]["식별번호"]}</span></td>
      </tr>
    `;
  }
  let table_tag = `
    <table class="table table-dark">
      <thead>
        <tr>
          <th scope="col">단과대학</th>
          <th scope="col">학부(과)</th>
          <th scope="col">식별번호</th>
        </tr>
      </thead>
      <tbody>
        ${html_tag}
      </tbody>
    </table>
  `;
  return table_tag;
}