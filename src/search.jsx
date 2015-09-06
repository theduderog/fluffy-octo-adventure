$(function() {

    var es = new $.es.Client({
      hosts: 'localhost:9200',
      log: 'trace'
    });

    var searchController = function() {
      var listener;
      return {
        setListener: function (listenerCallback) {
          listener = listenerCallback;
        },
        doQuery: function (query) {
          if (listener) {
            listener(query);
          }
        }
      };
    }();

    var SearchForm = React.createClass({
      propTypes: {
        doQuery: React.PropTypes.func.isRequired
      },
      handleSubmit: function(e) {
        e.preventDefault();
        var query = React.findDOMNode(this.refs.query).value.trim();
        if (!query) {
          return;
        }
        this.props.doQuery(query);
      },
      render: function() {
        return (
          <form className="navbar-form navbar-left" onSubmit={this.handleSubmit}>
            <input type="text" className="form-control searchbar" placeholder="Search..." ref="query" />
          </form>
        );
      }
    });

    var SearchResultList = React.createClass({
      propTypes: {
        pageSize: React.PropTypes.number
      },
      doQuery: function (queryStr) {
        es.search({
          index: 'darwin-origin',
          type: 'chapter',
          body: {
            _source: {
              exclude: [ "text" ]
            },
            size: this.props.pageSize, 
            query: {
              query_string: {
                 query: queryStr
              }
            }
          }
        }).then(function (resp) {
          this.setState({
            numHits: resp.hits.total,
            hits: resp.hits.hits.map(function (hit) {
              return {name: "Chapter " + hit._source.numeral, url: "http://www.google.com", summary: hit._source.title}
            })
          })
        }.bind(this), function (err) {
          console.trace(err.message);
        });
      },
      getInitialState: function() {
        return {numHits: 0, hits: []};
      },
      componentWillMount: function () {
        searchController.setListener(this.doQuery.bind(this));
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
        if (this.state.numHits > 0) {
          return (
            <div className="results-list">
              <div className="row">
                <p>Showing {resultsNodes.length} of {this.state.numHits} hits</p>
              </div>
              {resultsNodes}
            </div>
          );
        }
        return (<p>No results</p>);
      }
    });

    React.render(
      <SearchResultList pageSize={10}/>,
      document.getElementById('search')
    );
    React.render(
      <SearchForm doQuery={searchController.doQuery.bind(searchController)} />,
      document.getElementById('search-form')
    )
});