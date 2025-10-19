let table;

function preload() {
  // put preload code here
  table = loadTable("dataset.csv", "csv", "header");
}

function setup() {
  // controllo se ho caricato i dati

  let outerPadding = 20; //padding esterno
  let padding = 10; //padding tra gli elementi
  let itemSize = 30; //dimensioni degli elementi

  // calcolo il numero di colonne
  //colonne = larghezza - 2 per il padding esterno / diviso dell'item + più il paddig interno
  let cols = floor((windowWidth - outerPadding * 2) / (itemSize + padding)); //arrotondo per difetto (meglio avere colonne in meno che colonne sbordanti)

  // calcolo il numero delle righe / diviso per il numero delle colonne
  let rows = ceil(table.getRowCount() / cols);

  let totalHeight = outerPadding * 2 + rows * itemSize + (rows - 1) * padding;

  //creo il canvas
  //larghezza della finestra e altezza calcolata
  createCanvas(windowWidth, totalHeight);

  background("purple");

  console.log("cols: ", cols, " rows: ", rows);

  // salvo le variabili globali se servono nel draw
  window.outerPadding = outerPadding;
  window.padding = padding;
  window.itemSize = itemSize;
  window.cols = cols;
  window.rows = rows;
}

function draw() {
  background("purple");

  let colCount = 0;
  let rowCount = 0;

  //così legge ogni riga
  for (let rowNumber = 0; rowNumber < table.getRowCount(); rowNumber++) {
    //carico dati della tabella per ogni riga
    let data = table.getRow(rowNumber).obj;
    console.log(data);

    // prendo valore per dimensione
    let myValue = data["column0"];

    //devo creare una funzione di scala
    //calcolo il valore minimo (min) e massimo (max)
    let allValues = table.getColumn("column0");
    let minValue = min(allValues);
    let maxValue = max(allValues);
    let scaledValue = map(myValue, minValue, maxValue, 1, itemSize);

    //seconda variabile per il colore
    let value2 = data["column2"];
    let allValues2 = table.getColumn("column2");
    let minValue2 = min(allValues2);
    let maxValue2 = max(allValues2);
    let value2Mapped = map(value2, minValue2, maxValue2, 0, 1);
    
    //due colori dei simboli che sfumano
    let c1 = color("white");
    let c2 = color("blue");

    //risultato del mapping
    let mappedColor = lerpColor(c1, c2, value2Mapped);
    fill(mappedColor);

    //posizione della x (orizzontale) e y (verticale)
    let xPos = outerPadding + colCount * (itemSize + padding);
    let yPos = outerPadding + rowCount * (itemSize + padding);

    rect(xPos, yPos, scaledValue, scaledValue);

    // ad ogni ciclo aumento colCount
    colCount++;

    // controllo se siamo a fine riga
    if (colCount == cols) {
      colCount = 0;
      rowCount++;
    }
  }
}
