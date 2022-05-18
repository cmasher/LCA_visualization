// функция, в которой реализован алгоритм двоичного подъема, а так же анимация
// на вход передаются данные графа (graph), а так же узлы, для которых будет выполняться поиск общей вершины (node_1, node_2)
// за основу взят код из https://www.geeksforgeeks.org/lca-in-a-tree-using-binary-lifting-technique/

// массив, в котором будут храниться "снимки" графа (анимация препроцессинга)
var preprocessFrames = new Array();

// массив, в котором будут храниться "снимки" графа (анимация основного этапа расчета)
var frames = new Array();

function geek(graph, node_1, node_2) {
    preprocessFrames = new Array();
    frames = new Array();

    // добавляем первый "снимок" графа (без раскшрашивания)
    frames.push(graph);

    var currentGraph = graph;
    var preprocessGraph = graph;

    // массив, в котором будет храниться граф
    let g;
    // memo[i][j] содержит 2^j-й предка узла i
    // lev хранит глубину (удаленность от корневого узла)
    let memo, lev, log;
    // сохраняем граф в виде пар узлов
    let graphPairs = getNodePairs(graph);

    // сохраняем в n количество узлов графа
    let n = getNumberOfNodes(graphPairs);
    g = new Array(n + 1);

    // log(n) с основанием 2
    log = Math.ceil(Math.log(n) / Math.log(2));
    memo = new Array(n + 1);

    // Инициализируем lev нулями
    lev = new Array(n + 1);
    lev.fill(0);

    // Инициализируем memo значением -1
    for (let i = 0; i <= n; i++) {
        memo[i] = new Array(log+1);
        for (let j = 0; j < log+1; j++) {
            memo[i][j] = -1;
        }
    }
    for (let i = 0; i <= n; i++)
      g[i] = [];

    // заполняем массив g значениями graphPairs 
    fillEdges(graphPairs);
    var logArea = jQuery('#preprocessLog_div');
    // запускаем препроцессинг
    dfs(1, 1);

    // запускаем расчет и выводим результат в консоль
    console.log("The LCA of " + node_1 + " and " +node_2 + " is " +  lca(node_1, node_2));

    

    // функция препроцессинга, заполнение memo[][]
    function dfs(u, p) {
        // рекурсивно вычисляем значения memo[][]
        memo[u][0] = p;

        var prevAncestor  = memo[u][0];
        for (let i = 1; i <= log; i++) {
            memo[u][i] = memo[memo[u][i - 1]][i - 1];

            // выводим в консоль браузера узел и его 2^i предка
            logArea.val(logArea.val() + "\nu = " + u + ", " + Math.pow(2, i) + "-й предок: " + memo[memo[u][i - 1]][i - 1]);
            console.log("u = " + u + ", " + Math.pow(2, i) + "-й предок: " + memo[memo[u][i - 1]][i - 1]);


            if (!(prevAncestor == memo[u][i])) { // проверяем, добавляли ли уже снимок с тем же предком что и на предыдущем снимке
                // сохраняем "снимки" анимации препроцессинга.
                preprocessFrames.push(preprocessGraph);
                preprocessGraph += "\n" + u +" [color=green];";

                var t = u;
                while (t != memo[memo[u][i - 1]][i - 1]) {
                    preprocessGraph += "\n" + memo[t][0] +" [color=yellow];";
                    t = memo[t][0];
                }
                preprocessGraph += "\n" + memo[memo[u][i - 1]][i - 1] +" [color=green];";
                preprocessFrames.push(preprocessGraph);
                preprocessGraph = graph;
            }
            prevAncestor = memo[u][i];
        }

        for (let v = 0; v < g[u].length; v++) {
            if (g[u][v] != p) {

                // вычисляем глубину каждого узла
                lev[g[u][v]] = lev[u] + 1;
                dfs(g[u][v], u);
            }
        }
    }

    // функция высчитывающая наименьшего общего предка для узлов u и v
    function lca(u, v) {
        // узел, наиболее удаленный от корня берем за u
        // если v расположен дальше, чем u, то меняем их местами
        if (lev[u] < lev[v]) {
            let temp = u;
            u = v;
            v = temp;
        }

        // расрашиваем узлы, для которых нужно найти наименьшего общего предка в серый цвет
        // сохраняем "снимок"
        currentGraph += "\n" + u +" [color=gray];";
        currentGraph += "\n" + v +" [color=gray];";
        frames.push(currentGraph);

        // находим предка u, который расположен на том же уровне что и v
        for (let i = log; i >= 0; i--) {
            if ((lev[u] - Math.pow(2, i)) >= lev[v]) {
                u = memo[u][i];

                // потенциальный результат закрашиваем желтым цветом
                currentGraph += "\n" + u +" [color=yellow];";
                frames.push(currentGraph);
            }
        }

        // если v является предком u
        // тогда v является наименьшим общим предком для u и v
        if (u == v) {
            // раскрашиваем итоговый узел зеленым цветом, сохраняем "снимок"
            currentGraph += "\n" + u +" [color=green];";
            frames.push(currentGraph);

            return u;
        }

        // находим узел, ближайший к корню, но который не является общим предком для u и v
        // узел раскрашиваем голубым цветом, и сохраняем "снимок"
        for (let i = log; i >= 0; i--) {
            if (memo[u][i] != memo[v][i]) {
                u = memo[u][i];
                v = memo[v][i];

                currentGraph += "\n" + u +" [color=blue];";
                currentGraph += "\n" + v +" [color=blue];";
                frames.push(currentGraph);
            }
        }

        // полученный ответ (расположенный в memo[u][0]) закрашиваем зеленым (и добавляем "снимок")
        currentGraph += "\n" + memo[u][0] +" [color=green];";
        frames.push(currentGraph);

        return memo[u][0];
    }

    // парсинг данных графа (из текстового поля):
    // для каждой строки удаляем пробелы, затем получаем пару значений (разделитель "--")
    // полученную пару значений добавляем в массив pairs
    function getNodePairs(graph) {
        var pairs = new Array();
        var graphString = graph.replace(/ /g, '').split('\n');
        graphString.forEach(str => {
            var pair = str.split('--');
            pairs.push(pair);
        });
        return pairs;
    }

    // считаем количество узлов в графе:
    // сохраняем все значения из graphPairs в set (в set сохраняются только уникальные значения),
    // размер итогового множества и будет являться количеством узлов графа
    function getNumberOfNodes(graphPairs) {
        var set = new Set();

        graphPairs.forEach(pair => {
            set.add(pair[0]);
            set.add(pair[1]);
        });

        return set.size;
    }

    // заполняем массив g значениями из graphPairs
    function fillEdges(graphPairs) {
        graphPairs.forEach(pair => {
            g[pair[0]].push(pair[1]);
            g[pair[1]].push(pair[0]);
        });
    }
}
