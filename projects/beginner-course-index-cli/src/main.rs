use std::process::ExitCode;

fn main() -> ExitCode {
    match beginner_course_index_cli::cli::run(std::env::args().skip(1)) {
        Ok(output) => {
            println!("{output}");
            ExitCode::SUCCESS
        }
        Err(error) => {
            eprintln!("{error:?}");
            ExitCode::from(1)
        }
    }
}
