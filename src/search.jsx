$(function() {

    var client = new $.es.Client({
      hosts: 'localhost:9200'
    });

    var SearchResultList = React.createClass({
      getInitialState: function() {
        return {
          numHits: 12,
          hits: [{name: "Chapter 2", url: "http://www.google.com", summary: "VARIATION UNDER NATURE"}]};
      },
      render: function() {
        var resultsNodes = this.state.hits.map(function (result) {
          return (
              <div className="row">
                <p className="title"><a href={result.url}>{result.name}</a></p>
                <p className="summary small"><em>{result.summary}</em></p>
              </div>
          );
        });
        return (
          <div className="results-list">
            <div className="row">
              <p>{this.state.numHits} hits</p>
            </div>
            {resultsNodes}
          </div>
        );
      }
    });


    React.render(
      <SearchResultList pageSize={10}/>,
      document.getElementById('search')
    );
});