//create a new page that has a text input with a submit button. When the button is pressed, if there is text, it will be displayed below the input field.


//first, create a new page called new.tsx in the pages folder. Then, add the following code to the page:
export default function New() {
    return (
        <div>
        <input type="text" />
        <button>Submit</button>
        </div>
    );
    }