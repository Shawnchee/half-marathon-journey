"""Regression checks for logging after local midnight but before UTC midnight."""
import datetime as dt
import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('journal_build', Path(__file__).resolve().parents[1] / 'scripts/build.py')
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)


class CompletedDateTests(unittest.TestCase):
    def test_next_date_is_rejected_before_local_midnight(self):
        with self.assertRaises(ValueError):
            build.require_completed_date('2026-11-11', dt.datetime(2026, 11, 10, 15, 59, 59, tzinfo=dt.timezone.utc))

    def test_local_today_is_accepted_at_midnight(self):
        build.require_completed_date('2026-11-11', dt.datetime(2026, 11, 10, 16, tzinfo=dt.timezone.utc))

    def test_actual_failed_deployment_time_accepts_both_run_dates(self):
        instant = dt.datetime(2026, 11, 10, 16, 41, 26, tzinfo=dt.timezone.utc)
        build.require_completed_date('2026-10-29', instant)
        build.require_completed_date('2026-11-11', instant)
        with self.assertRaises(ValueError):
            build.require_completed_date('2026-11-12', instant)

    def test_year_boundary_uses_journal_calendar(self):
        build.require_completed_date('2027-01-01', dt.datetime(2026, 12, 31, 16, tzinfo=dt.timezone.utc))


if __name__ == '__main__':
    unittest.main()
