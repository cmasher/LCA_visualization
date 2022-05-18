jQuery(document).ready(function () {

  var graph_data = jQuery('#graph_data');
  var node_1 = jQuery('#node_1');
  var node_2 = jQuery('#node_2');
  var start_btn = jQuery('#start_btn');
  var startPreproc_btn = jQuery('#startPreproc_btn');


  // основная функция (выполняется сразу при загрузке)
  jQuery(function() {
    // задаем значения по умолчанию для полей ввода: graph, node#1, node#2
    let defaultGraph =
`1 -- 2
2 -- 9
2 -- 3
3 -- 8
3 -- 4
4 -- 6
4 -- 5
6 -- 7
1 -- 13
13 -- 10
13 -- 11
11 -- 12
12 -- 14
7 -- 15
15 -- 16
14 -- 17
17 -- 18`;
    graph_data.val(defaultGraph);
    node_1.val(10);
    node_2.val(15);

    // задаем обработчик события для кнопки Start
    start_btn.click(Start);
    startPreproc_btn.click(StartPreprocessing);

    // начать анимацию сразу, не дожидаясь клика по кнопке
    // StartPreprocessing();
    // Start();
  });

  var interval;

  function Start() {
    jQuery('#preprocessLog_div').val("");

    // выполняем расчет, заполняем массивы с анимацией
    geek(graph_data.val(), node_1.val(), node_2.val());

    // далее отрисовываем основномй процесс:
    // первый кадр отрисовываем без задержки
    DrawGraph(frames[0]);

    // все кадры после первого отрисовываем с задержкой 1с (1000 мс)
    var i = 1;
    clearInterval(interval);
    interval = setInterval(() => {
        DrawGraph(frames[i++]);
        if (i == frames.length)
            clearInterval(interval);
    }, 1000);

  }

  function StartPreprocessing() {
    jQuery('#preprocessLog_div').val("");

    // выполняем расчет, заполняем массивы с анимацией
    geek(graph_data.val(), node_1.val(), node_2.val());

    // далее отрисовываем основномй процесс:
    // первый кадр отрисовываем без задержки
    DrawGraph(preprocessFrames[0]);

    // все кадры после первого отрисовываем с задержкой
    var i = 1;
    clearInterval(interval);
    interval = setInterval(() => {
        DrawGraph(preprocessFrames[i++]);
        if (i == preprocessFrames.length)
            clearInterval(interval);
    }, 500);
  }

});

// отрисовка графа, данные графа передаются параметром graph_data
function DrawGraph(graph_data) {
  var svg_div = jQuery('#graph_svg_div');

  // оборачиваем данные, для соответствия формату библиотеки Viz
  // подробнее о формате и библиотеке Viz см. http://www.graphviz.org/doc/info/lang.html
  var data = "strict graph Tree {node [style=filled];\n" + graph_data + "\n}";

  // создаем svg-изображение через библиотеку Viz, полученное изображение добавляем на страницу в элемент svg_div
  svg_div.html(Viz(data, "svg"));
}
