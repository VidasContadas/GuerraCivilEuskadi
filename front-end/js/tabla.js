var url = "http://guerracivileuskadi.eurohelp.es:18888/blazegraph/namespace/kb/sparql";

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function generarTabla(tipoEvento, fecha) {

    console.log(tipoEvento);
    console.log(fecha);

    if (tipoEvento.includes("missing-person")) {

        var sentencia = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
            "PREFIX dbo: <http://dbpedia.org/ontology/>" +
            "select * where { " +
            "     ?person dbo:date '" + fecha + "'^^xsd:date ." +
            "   ?person rdf:type <http://id.euskadi.eus/def/euskadipedia/missing-person> ." +
            "     ?person <http://dbpedia.org/ontology/birthPlace> ?birthPlace ." +
            "   ?person <http://dbpedia.org/ontology/deathPlace> ?deathPlace ." +
            "   ?person <http://id.euskadi.eus/def/euskadipedia/death-mode> ?deathMode ." +
            "   ?person rdfs:label ?label" +
            "}";

        contadorRepeticiones = 0;

        var options = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "POST",
            "dataType": "xml",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/sparql-results+xml;charset=UTF-8",
                "Cache-Control": "true",
            },
            "data": "query=" + sentencia
        }

        $.ajax(options).done(function(respuesta) {

            tabla = "";
            tabla += "<tr>";

            $(respuesta).find("head").find("variable").each(function(index, element) {
                tabla += "<th>" + $(element).attr("name") + '</th>';
                contadorRepeticiones++;
            });

            tabla += "</tr>";
            var l;

            $(respuesta).find("results").find("result").each(function(index, element) {

                tabla += "<tr>";
                person = $(element).find("binding[name='person']").find("uri").text();
                birthPlace = $(element).find("binding[name='birthPlace']").find("uri").text();
                deathPlace = $(element).find("binding[name='deathPlace']").find("uri").text();
                deathMode = $(element).find("binding[name='deathMode']").find("uri").text();
                label = $(element).find("binding[name='label']").find("literal").text();

                tabla += '<td>' + '<a href=' + person + ' target="_blank">' +
                    person + '</a></td>';
                tabla += '<td>' + '<a href=' + birthPlace + ' target="_blank">' +
                    birthPlace + '</a></td>';
                tabla += '<td>' + '<a href=' + deathPlace + ' target="_blank">' +
                    deathPlace + '</a></td>';
                tabla += '<td>' + '<a href=' + deathMode + ' target="_blank">' +
                    deathMode + '</a></td>';
                tabla += '<td>' + label + '</a></td>';

                tabla += "</tr>";

                tabla += "</tr>";
            });

            var posicionTabla = document.getElementById('contenedorTabla');
            posicionTabla.innerHTML = '<table border=1>' + tabla + '</table>';

        });
    }

    if (tipoEvento.includes("bombing")) {

        var sentencia = "prefix dcterm: <http://purl.org/dc/terms/>" +
            "PREFIX eli: <http://data.europa.eu/eli/ontology#>" +
            "PREFIX schema: <http://schema.org/>" +
            "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
            "PREFIX dbo: <http://dbpedia.org/ontology/>" +
            "select * where {" +
            "     ?bombardment dbo:date '" + fecha + "'^^xsd:date ." +
            "   ?bombardment rdf:type <http://dbpedia.org/resource/Aerial_bombing_of_cities> ." +
            "?bombardment schema:location ?location ." +
            "   ?bombardment dcterm:source ?source ." +
            "     ?bombardment rdfs:comment ?comment ." +
            "}";

        contadorRepeticiones = 0;

        var options = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "POST",
            "dataType": "xml",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/sparql-results+xml;charset=UTF-8",
                "Cache-Control": "true",
            },
            "data": "query=" + sentencia
        }

        $.ajax(options).done(function(respuesta) {
            console.log(respuesta);

            tabla = "";
            tabla += "<tr>";

            $(respuesta).find("head").find("variable").each(function(index, element) {
                tabla += "<th>" + $(element).attr("name") + '</th>';
                contadorRepeticiones++;
            });

            tabla += "</tr>";
            var l;

            $(respuesta).find("results").find("result").each(function(index, element) {

                tabla += "<tr>";
                bombardment = $(element).find("binding[name='bombardment']").find("uri").text();
                source = $(element).find("binding[name='source']").find("literal").text();
                localizacion = $(element).find("binding[name='location']").find("uri").text();
                comment = $(element).find("binding[name='comment']").find("literal").text();

                tabla += '<td>' + '<a href=' + bombardment + ' target="_blank">' +
                    bombardment + '</a></td>';
                tabla += '<td>' +
                    source + '</a></td>';
                tabla += '<td>' + '<a href=' + localizacion + ' target="_blank">' +
                    localizacion + '</a></td>';
                tabla += '<td>' +
                    comment + '</a></td>';

                tabla += "</tr>";

                tabla += "</tr>";
            });

            var posicionTabla = document.getElementById('contenedorTabla');
            posicionTabla.innerHTML = '<table border=1>' + tabla + '</table>';

        });
    }

    if (tipoEvento.includes("LegalResource")) {

        var sentencia = "PREFIX eli: <http://data.europa.eu/eli/ontology#>" +
            "PREFIX schema: <http://schema.org/>" +
            "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
            "PREFIX dbo: <http://dbpedia.org/ontology/>" +
            "select ?legeguneaurl ?title where { " +
            "     ?legalResource dbo:date '" + fecha + "'^^xsd:date ." +
            "   ?legalResource rdf:type <http://data.europa.eu/eli/ontology#LegalResource> ." +
            "     ?legalResource eli:is_realized_by ?legalexpresion ." +
            "   ?legalexpresion eli:title ?title ." +
            "?eliformat eli:embodies ?legalexpresion ." +
            "?eliformat schema:mainEntityOfPage ?legeguneaurl ." +
            "}";

        contadorRepeticiones = 0;

        var options = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "POST",
            "dataType": "xml",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/sparql-results+xml;charset=UTF-8",
                "Cache-Control": "true",
            },
            "data": "query=" + sentencia
        }

        $.ajax(options).done(function(respuesta) {
            console.log(respuesta);

            tabla = "";
            tabla += "<tr>";

            $(respuesta).find("head").find("variable").each(function(index, element) {
                tabla += "<th>" + $(element).attr("name") + '</th>';
                contadorRepeticiones++;
            });

            tabla += "</tr>";
            var l;

            $(respuesta).find("results").find("result").each(function(index, element) {

                tabla += "<tr>";
                titulo = $(element).find("binding[name='title']").find("literal").text();
                legeguneaurl = $(element).find("binding[name='legeguneaurl']").find("uri").text();

                tabla += '<td>' +
                    titulo + '</a></td>';
                tabla += '<td>' + '<a href=' + legeguneaurl + ' target="_blank">' +
                    legeguneaurl + '</a></td>';

                tabla += "</tr>";

                tabla += "</tr>";
            });

            var posicionTabla = document.getElementById('contenedorTabla');
            posicionTabla.innerHTML = '<table border=1>' + tabla + '</table>';

        });
    }
}