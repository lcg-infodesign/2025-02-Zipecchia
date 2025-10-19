let table;

function preload() {
  // put preload code here
  table = loadTable("dataset.csv", "csv", "header");
}

function setup() {
  // controllo se ho caricato i dati

  frameRate(90) //per dare maggiore fluidità

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
  //noLoop(); //così viene disegnato una sola volta --> mi serve per l'animazione

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

    //rect(xPos, yPos, scaledValue, scaledValue); --> non voglio più dei rettangoli (erano la base)

    //parto mettendo i valori delle colonne che serviranno per i glifi
    let values = [
      Number(data["column0"]),
      Number(data["column1"]),
      Number(data["column2"]),
      Number(data["column3"]),
      Number(data["column4"])
     ];

    //collego la funzione che disegna i glifi (i cerchi concentrici nel mio caso)
    drawConcentricGlyph(xPos, yPos, values);

    // ad ogni ciclo aumento colCount
    colCount++;

    // controllo se siamo a fine riga
    if (colCount == cols) {
      colCount = 0;
      rowCount++;
    }
  }
}

//creo la funzione che mi disegna i glifi
function drawConcentricGlyph(x, y, values) {
  push(); //così modifico solo questa sezione

  //trasformazioni globali
  translate(x + itemSize / 2, y + itemSize / 2);

  //COLUMN4 controlla la SCALA
  let s = map(values[4], 0, 100, 0.6, 1.4);
  scale(s);

  noFill();
  colorMode(RGB, 255);
  
  //COLUMN2 controlla il COLORE (dal bianco al blu)
  let c1 = color(255, 255, 255);
  let c2 = color(0, 0, 255);
  let tColor = map(values[2], 0, 100, 0, 1); // colonna 2 = gradazione blu
  let strokeCol = lerpColor(c1, c2, tColor);

  //COLUMN0 controlla il NUMERO DEI CERCHI
  let numeroCerchi = int(map(values[0], 0, 100, 3, 20));

  //COLUMN3 controlla lo SPESSORE
   let strokeW = map(values[3], 0, 100, 1, 5);
  strokeWeight(strokeW);

  // Disegno cerchi concentrici pulsanti
  stroke(strokeCol);

  // COLUMN1 controlla la VELOCITÀ e AMPIEZZA dell’animazione
  let speed = map(values[1], 0, 100, 0.03, 0.15);
  let amplitude = map(values[1], 0, 100, 0.03, 0.15); // più alto = pulsazione più ampia
  let pulsation = sin(frameCount * speed) * amplitude;

  // diametro massimo (oscilla nel tempo)
  let diametroMax = itemSize * 0.9 * (1 + pulsation);
  let spacing = diametroMax / numeroCerchi;

  for (let i = 0; i < numeroCerchi; i++) {
    let diametro = max(6, diametroMax - i * spacing);
    ellipse(0, 0, diametro, diametro);
  }

  // Cerchio centrale pieno che pulsa insieme
  let innerColor = lerpColor(c2, c1, tColor * 0.5);
  fill(innerColor);
  noStroke();
  ellipse(0, 0, itemSize * 0.2 * (1 + pulsation), itemSize * 0.2 * (1 + pulsation));


  pop (); //ora torna tutto come prima
}
