
document.addEventListener("keyup", function(event) {
    const target = event.target;
    if (target.matches("input[type='text'], input[type='search'], textarea")) {
        const text = target.value;
        
        // Send input to backend for grammar checking and word suggestion
        fetch(`https://api.languagetool.org/v2/check?text=${text}&language=en-US`, {
            "method": "GET",
        })
        .then(response => response.json())
        .then(data => {
            // Parse suggestions from response
            const matches = data.matches;
            const suggestions = matches.map(match => {
                return { error: match.context.text.substring(match.context.offset, match.context.offset+match.context.length), suggestion: match.replacements[0].value };
            });

            // Display suggestions to the user
            const suggestionsDiv = document.getElementById("suggestions");
            suggestionsDiv.innerHTML = "";
            for (let i = 0; i < suggestions.length; i++) {
                const suggestion = suggestions[i];
                const suggestionElement = document.createElement("div");
                suggestionElement.innerHTML = `Did you mean <span class="suggestion">${suggestion.suggestion}</span> instead of <span class="error">${suggestion.error}</span>?`;
                suggestionElement.onclick = function() {
                    replaceWord(target, suggestion.error, suggestion.suggestion);
                }
                suggestionsDiv.appendChild(suggestionElement);
            }
        })
        .catch(err => {
            console.error(err);
        });
    }
});

function replaceWord(target, error, suggestion) {
    const regex = new RegExp(error, "g");
    target.value = target.value.replace(regex, suggestion);
}
