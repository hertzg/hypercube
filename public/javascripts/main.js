$(function() {
  ace.config.set(
    "basePath",
    "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.11/"
  );
  const langTools = ace.require("ace/ext/language_tools");
  const configEditor = ace.edit("params-editor");
  configEditor.session.setMode("ace/mode/javascript");
  configEditor.setTheme("ace/theme/monokai");
  configEditor.setOptions({
    enableBasicAutocompletion: true
  });

  $("form").submit(function(e) {
    e.preventDefault();
    const me = $(this);

    $("#prev").text($("#output").text());
    $("#output").text("Processing...");

    const formData = new FormData(this);
    Object.entries(eval(`(${configEditor.getValue()});`)).forEach(([k, v]) =>
      formData.set(k, v)
    );

    $.ajax({
      type: me.attr("method"),
      enctype: me.attr("enctype"),
      url: me.attr("action"),
      data: formData,
      processData: false,
      contentType: false,
      cache: false,
      success: data => {
        const prev = $("#prev").text();
        const latest = data.response.output;

        const maxRows = Math.max(
          latest.split("\n").length,
          prev.split("\n").length
        );

        $("#output")
          .text(latest)
          .attr("rows", maxRows);

        $("#prev").attr("rows", maxRows);
      },
      error: () => {
        $("#output").text("Error!");
      }
    });
  });

  $.ajax({
    type: "get",
    url: "/tesseract/parameters",
    success: ({ data }) => {
      const fzs = new FuzzySearch({
        source: data,
        keys: ["key", "description"],
        output_map: "root"
      });

      langTools.addCompleter({
        getCompletions: function(editor, session, pos, prefix, callback) {
          const matches = fzs.search(prefix);

          let completions = matches.map(
            ({ item: { key, defaultValue, description }, score }, i) => ({
              name: key,
              value: key,
              caption: `${key} [${defaultValue}] - ${description}`,
              meta: 'tesseract',
              score: score
            })
          );

          console.log(prefix, completions);
          callback(null, completions);
        }
      });
      /*
                      name: key,
                value: key,
                caption: key,
                meta: `${defaultValue} - ${description}`,
                score: score
       */

      configEditor.setValue(localStorage.getItem("params") || "", -1);

      setInterval(() => {
        localStorage.setItem("params", configEditor.getValue());
      }, 1000);
    }
  });
});