window.onload = function() {
	var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), {
		sheetCount: 1
	});

	/*
    * get spread object
    * var spread = GC.Spread.Sheets.findControl(document.getElementById('ss'));
    */
	initSpread(spread);
};

function initSpread(spread) {
	var sheet = spread.getActiveSheet();
	sheet.setColumnWidth(0, 160);
	sheet.setColumnWidth(1, 70);
	sheet.setColumnWidth(2, 90);
	sheet.setColumnWidth(3, 110);
	sheet.setColumnWidth(4, 80);
	sheet.setColumnWidth(6, 110);
}
