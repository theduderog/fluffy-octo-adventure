$(function() {

    var client = new $.es.Client({
      hosts: 'localhost:9200'
    });

    var SearchResultList = React.createClass({
      getInitialState: function() {
        return {data: [1, 2, 3]};
      },
      render: function() {
        var resultsNodes = this.state.data.map(function (result) {
          return (
              <div className="row">
            <p>Search result {result}</p>
              </div>
          );
        });
        return (
          <div className="results-list">
            {resultsNodes}
          </div>
        );
      }
    });


    React.render(
      <SearchResultList foo="bar"/>,
      document.getElementById('search')
    );
});