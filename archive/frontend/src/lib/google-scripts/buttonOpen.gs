function buttonOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🎲 Betting Tools')
      .addItem('Add New Bet', 'addNewBet')
      .addToUi();
}

function addNewBet() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  // Insert new row and set date
  sheet.insertRowAfter(lastRow);
  sheet.getRange(lastRow + 1, 2).setValue(new Date());
  
  // Copy bankroll formula
  sheet.getRange(lastRow + 1, 11).setFormula('=K' + lastRow);
}