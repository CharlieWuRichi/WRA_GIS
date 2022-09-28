$(function () {
  // 設定日期格式
  var dateFormat = 'yy/mm/dd',
    // 設定開始日曆
    from = $('#from')
      .datepicker({
        // 顯示小日曆icon：顯示icon、檔案位置、不要按鈕底色、hover顯示字樣
        showOn: 'button',
        buttonImage: 'assets/image/backend/calendar.gif',
        buttonImageOnly: true,
        buttonText: 'Select date',
        // 設定日期格式：年月日
        dateFormat: 'yy/mm/dd',
        // 預設顯示日期：今天
        defaultDate: 'today',
        // 更換月份的下拉選單：是
        changeMonth: true,
        // 顯示月份數量：1個月
        numberOfMonths: 1,
        // 顯示底部的按鈕（今天／關閉）：是
        showButtonPanel: true,
      })
      // 當確定開始時間，結束時間日曆上的最早日期為開始時間
      .on('change', function () {
        to.datepicker('option', 'minDate', getDate(this));
      });

  // 設定結束日曆
  to = $('#to')
    .datepicker({
      showOn: 'button',
      buttonImage: 'assets/image/backend/calendar.gif',
      buttonImageOnly: true,
      buttonText: 'Select date',
      dateFormat: 'yy/mm/dd',
      defaultDate: 'today',
      changeMonth: true,
      numberOfMonths: 1,
      showButtonPanel: true,
    })
    .on('change', function () {
      from.datepicker('option', 'maxDate', getDate(this));
    });

  // 不清楚這個是要做什麼（這個是從source code上複製過來的）
  function getDate(element) {
    var date;
    try {
      date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
      date = null;
    }
    return date;
  }
});

var thisJSON;

// 用ajax接外部json檔案，取得後執行renderJSON()
$.ajax({
  dataType: 'json',
  method: 'GET',
  url: 'assets/json/Backend.json',
  data: '',
  success: function (data) {
    // 資料載入再套DataTables，才不會顯示資料沒有進去
    renderJSON(data);
    jQueryDataTable(data);
    // 用變數把資料傳出來
    thisJSON = data;
    console.log(thisJSON);
    return thisJSON;
  },
});

// 在表格中印出資料
function renderJSON(data) {
  var tableHTML = `
  <table id="table_id" class="compact hover">
    <thead>
      <tr>
        <td>ID</td>
        <td>統計圖</td>
        <td>是否顯示</td>
        <td data-orderable="false">動作</td>
      </tr>
    </thead>
    <tbody id="BackendData"></tbody>
  </table>`;
  $('.table_container').append(tableHTML);

  for (i = 0; i < data.length; i++) {
    var HTML = `
    <tr>
      <td class="rowId" id=${data[i].rowId}>${i + 1}</td>
      <td>${data[i].chartName}</td>
      <td>${data[i].isShowName}</td>
      <td>
        <button onclick="showEditPopUp(this)">編輯</button>
        <br>
        <button onclick="deleteData(this)">刪除</button>
        </td>
    </tr>>`;
    $('#BackendData').append(HTML);
  }
}

// 套用 jQuery DataTable 樣式
function jQueryDataTable() {
  $('#table_id').DataTable({
    language: {
      url: 'assets/json/zh-HANT.json',
    },
    stripeClasses: ['stripe-1', 'stripe-2'],
    lengthChange: false,
    searching: false,
    lengthMenu: [7],
    pagingType: 'full_numbers',
  });
}

// 點擊新增時，跳出視窗
function showAddPopUp() {
  $('#popUp_title').html('新增');
  $('#editData').css('display', 'none');
  $('.popUp').css('display', 'block');
}

// 點擊編輯時，跳出視窗
var thisObject;
function showEditPopUp(e) {
  $('#popUp_title').html('編輯');
  $('#saveNewData').css('display', 'none');
  $('.popUp').css('display', 'block');

  // 列印出來原本的資料
  var thisId = $(e).parent().parent().children()[0].id;
  thisObject = thisJSON.find((thisJSON) => thisJSON.rowId === thisId);
  $('#popUpChart').val(thisObject.chartId);
  console.log(thisObject.isShow);
  if (thisObject.isShow == 'Y') {
    $('#RadioYes').prop('checked', true);
  } else if (thisObject.isShow == 'N') {
    $('#RadioNo').prop('checked', true);
  }
}

// 輸入新資料
function saveNewData() {
  // 下拉選單資料驗證
  if ($('#popUpChart').val() == null) {
    $('#popUpChartLabel').addClass('required');
  } else {
    $('#popUpChartLabel').removeClass('required');
  }

  // Radio資料驗證
  if ($('input[name="show"]:checked').val() == undefined) {
    $('#popUpRadioLabel').addClass('required');
  } else {
    $('#popUpRadioLabel').removeClass('required');
  }

  // 如果都有填資料，執行以下動作
  if (
    $('#popUpChart').val() !== null &&
    $('input[name="show"]:checked').val() !== undefined
  ) {
    var newData = {
      rowId: (thisJSON.length + 1).toString(),
      dataId: (thisJSON.length + 1).toString(),
      chartId: $('#popUpChart option:selected').val(),
      chartName: $('#popUpChart option:selected').text(),
      isShow: $('input[name="show"]:checked').val(),
      isShowName: $('input[name="show"]:checked').attr('isShowName'),
    };
    // 將資料 unshift 進原本的JSON裡面
    thisJSON.unshift(newData);
    // 重新 render 一次表格
    $('.table_container').html('');
    renderJSON(thisJSON);
    jQueryDataTable(thisJSON);
    // 關掉視窗
    closePopUp();
  }
}

// 編輯資料
function editData() {
  console.log(thisObject);
  // 取得新資料
  newData = {
    rowId: thisObject.rowId,
    dataId: thisObject.dataId,
    chartId: $('#popUpChart option:selected').val(),
    chartName: $('#popUpChart option:selected').text(),
    isShow: $('input[name="show"]:checked').val(),
    isShowName: $('input[name="show"]:checked').attr('isShowName'),
  };
  // 取得新資料再原本資料的 index
  thisIndex = thisJSON.findIndex(
    (newData) => newData.rowId === thisObject.rowId,
  );
  // 更換新資料
  thisJSON.splice(thisIndex, 1, newData);
  // 重新 render 一次表格
  $('.table_container').html('');
  renderJSON(thisJSON);
  jQueryDataTable(thisJSON);
  // 關掉視窗
  closePopUp();
}

// 點擊取消時，關掉視窗
function closePopUp() {
  $('.popUp').css('display', 'none');
  // 關掉資料驗證的醒目文字
  $('#popUpChartLabel').removeClass('required');
  $('input[name="show"]Label').removeClass('required');
  // 清空表單資料
  $('#popUpChart').val(null);
  $('input[name="show"]').prop('checked', false);
  // 顯示兩個存檔紐（避免再開的時候不見）
  $('#saveNewData').css('display', 'block');
  $('#editData').css('display', 'block');
}

// 點擊刪除時，出現確認視窗
function deleteData(e) {
  // 如果確定刪除
  if (confirm('確定刪除該資料列') == true) {
    // 取得該筆資料的rowId
    var thisId = $(e).parent().parent().children()[0].id;
    // 取得該筆資料在資料中的 index（這句是網路上複製過來的）
    // 如果用原本的 id 當作 index，刪除掉資料後順序會不對
    var thisIndex = thisJSON.findIndex((thisJSON) => thisJSON.rowId === thisId);
    // 刪除該筆資料
    thisJSON.splice(thisIndex, 1);
    // 重新 render 一次表格
    $('.table_container').html('');
    renderJSON(thisJSON);
    jQueryDataTable(thisJSON);
  }
}

// 用 Esc 關掉彈出視窗
$(window).keydown(function (e) {
  if (e.code == 'Escape') {
    closePopUp();
  }
});
